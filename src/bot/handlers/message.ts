import { Client, Message, TextChannel } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigType } from 'src/types';
import { log } from '../../log';
import { getMember, sleep } from '../util';

const MAX_DEPTH = 3;
const HUMAN_NAME = 'Human';

export const messageHandler = (
  client: Client,
  {
    openai: { name, behavior, apiKey, model, temperature, maxTokens },
    autoRespondPrompts,
  }: ConfigType
) => {
  const stop = [` ${HUMAN_NAME}`, ` ${name}`];
  // eslint-disable-next-line max-len
  const behaviorString = `${name} is a chatbot that answers questions with ${behavior} responses:`;

  const getMessageChain = async (
    message: Message<boolean>,
    botId: string,
    reg: RegExp,
    depth = 0
  ): Promise<string> => {
    const isBot = message.member?.user.id === botId;
    const resp = `${isBot ? name : HUMAN_NAME}: ${message.content}`;
    if (depth >= MAX_DEPTH) return '';

    if (message.reference && message.reference.messageId) {
      const prevMessage = await message.fetchReference();
      if (prevMessage) {
        const prevContent = (
          await getMessageChain(prevMessage, botId, reg, depth + 1)
        ).replace(reg, name);
        return (prevContent ? prevContent + '\n' : '') + resp;
      }
    }

    return resp;
  };

  const configuration = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const createCompletion = async (prompt: string) => {
    return await openai.createCompletion({
      model,
      prompt,
      temperature,
      max_tokens: maxTokens,
      stop,
    });
  };

  return async (message: Message<boolean>) => {
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
      autoRespondPrompts.includes(message.content.toLocaleLowerCase().trim())
    ) {
      await message.channel.sendTyping();

      const questionContent = `${behaviorString}\n\n${await getMessageChain(
        message,
        client.user.id,
        reg
      )}`;

      log({
        now: new Date(),
        server: message.guild?.name,
        channel: (message.channel as TextChannel)?.name,
        questionContent,
      });

      try {
        log('Sending request...');
        const response = await createCompletion(questionContent);

        const result = response.data;
        log({ now: new Date(), ...response.data });

        try {
          await message.reply({
            content: result.choices[0]?.text
              ?.replace(/\n/g, '')
              .replace(new RegExp(`^.*${name}\: `), '')
              .trim(),
          });
        } catch (e: any) {
          log(`Error sending message: ${e.message}`);
        }
      } catch (e: any) {
        log(`Error getting content: ${e.message}`);
        log(questionContent);
      }
    }
  };
};
