import { Client, Message, TextChannel } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import { log } from '../../log';
import type { ChatCompletionMessage, ConfigType } from '../../types';
import { getMember, random, sleep } from '../util';

const HUMAN_NAME = 'Human';

export const messageHandler = (
  client: Client,
  {
    openai: {
      name,
      behavior,
      apiKey,
      model,
      temperature,
      maxTokens,
      conversationalDepth,
    },
    autoRespondPrompts,
    respondDelay,
    respondDelayTo,
  }: ConfigType
) => {
  // eslint-disable-next-line max-len
  const behaviorItem: ChatCompletionMessage = {
    role: 'system',
    content: `You are a ${behavior}`,
  };

  const getMessageChain = async (
    message: Message<boolean>,
    botId: string,
    depth = 0
  ): Promise<ChatCompletionMessage[]> => {
    const isBot = message.member?.user.id === botId;
    const resp: ChatCompletionMessage = {
      role: isBot ? 'assistant' : 'user',
      content: message.content,
    };

    if (depth >= conversationalDepth) return [];

    if (message.reference && message.reference.messageId) {
      const prevMessage = await message.fetchReference();
      if (prevMessage) {
        const prevContent = await getMessageChain(
          prevMessage,
          botId,
          depth + 1
        );
        return [...prevContent, resp];
      }
    }

    return [resp];
  };

  const configuration = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const createCompletion = async (messages: ChatCompletionMessage[]) => {
    return await openai.createChatCompletion({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });
  };

  return async (message: Message<boolean>) => {
    if (!client.user) {
      return;
    }
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
      (autoRespondPrompts.length &&
        autoRespondPrompts.includes(message.content.toLocaleLowerCase().trim()))
    ) {
      const questionContent = [
        behaviorItem,
        ...(await getMessageChain(message, client.user.id)),
      ];

      log({
        now: new Date(),
        server: message.guild?.name,
        channel: (message.channel as TextChannel)?.name,
        questionContent,
      });

      try {
        if (respondDelay) {
          if (!respondDelayTo || message.member?.user.id === respondDelayTo) {
            const delay = respondDelay + random(0, respondDelay);
            log(`Waiting ${delay / 1000} seconds to respond...`);
            await sleep(respondDelay + random(0, respondDelay));
          }
        } else {
          await sleep(600);
        }
        if (message.channel.isTextBased()) {
          await (message.channel as any).sendTyping();
        }
        log('Sending request...');
        const response = await createCompletion(questionContent);

        const result = response.data;
        log(JSON.stringify({ now: new Date(), ...response.data }, null, 2));

        try {
          await message.reply({
            content: result.choices[0]?.message?.content,
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
