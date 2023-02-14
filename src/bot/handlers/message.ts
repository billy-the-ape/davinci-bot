import { Client, Message, TextChannel } from 'discord.js';
import { createCompletion } from '../../openai';
import { getMember, sleep } from '../util';

const MAX_DEPTH = 3;
const BOT_NAME = process.env.OPENAI_NAME!;
const HUMAN_NAME = 'Human';
const STOP = [` ${HUMAN_NAME}`, ` ${BOT_NAME}`];
// eslint-disable-next-line max-len
const BEHAVIOR = `${BOT_NAME} is a chatbot that answers questions with ${process.env.OPENAI_BEHAVIOR} responses:`;

const RESPOND_PROMPTS = (() => process.env.RESPOND_PROMPTS?.split(',') ?? [])();

const getMessageChain = async (
  message: Message<boolean>,
  botId: string,
  reg: RegExp,
  depth = 0
): Promise<string> => {
  const isBot = message.member?.user.id === botId;
  const resp = `${isBot ? BOT_NAME : HUMAN_NAME}: ${message.content}`;
  if (depth >= MAX_DEPTH) return '';

  if (message.reference && message.reference.messageId) {
    const prevMessage = await message.fetchReference();
    if (prevMessage) {
      const prevContent = (
        await getMessageChain(prevMessage, botId, reg, depth + 1)
      ).replace(reg, BOT_NAME);
      return (prevContent ? prevContent + '\n' : '') + resp;
    }
  }

  return resp;
};

export const messageHandler =
  (client: Client) => async (message: Message<boolean>) => {
    if (!client.user) {
      return;
    }
    await sleep(600);
    const testIds = [`\\<@${client.user?.id}\\>`];
    if (message.guild) {
      const member = await getMember(message.guild!, client.user.id);

      const roleIds = member?.roles.cache.map(({ id }) => `\\<@&${id}\\>`);
      if (roleIds?.length) testIds.push(...roleIds);
    }

    const mentioned = !!message.mentions.users.get(client.user.id!);
    const reg = new RegExp(testIds.join('|'), 'g');
    if (
      mentioned ||
      reg.test(message.content) ||
      RESPOND_PROMPTS.includes(message.content.toLocaleLowerCase().trim())
    ) {
      await message.channel.sendTyping();

      const questionContent = `${BEHAVIOR}\n\n${await getMessageChain(
        message,
        client.user.id,
        reg
      )}`;

      console.info({
        now: new Date(),
        server: message.guild?.name,
        channel: (message.channel as TextChannel)?.name,
        questionContent,
      });

      try {
        const response = await createCompletion(questionContent, STOP);

        const result = response.data;
        console.info({ now: new Date(), ...response.data });

        try {
          await message.reply({
            content: result.choices[0]?.text
              ?.replace(/\n/g, '')
              .replace(new RegExp(`^.*${BOT_NAME}\: `), '')
              .trim(),
          });
        } catch (e: any) {
          console.error(`Error sending message: ${e.message}`);
        }
      } catch (e: any) {
        console.error(`Error getting content: ${e.message}`);
        console.error(questionContent);
      }
    }
  };
