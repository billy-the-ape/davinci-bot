import { Client, Message } from 'discord.js';
import { createCompletion } from '../../openai';
import { getMember } from '../util';

export const messageHandler =
  (client: Client) => async (message: Message<boolean>) => {
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
    if (mentioned || reg.test(message.content)) {
      console.info('AT ME DAWG');
      await message.channel.sendTyping();

      const questionContent = message.content.replace(reg, '');

      try {
        const response = await createCompletion(questionContent);

        const result = response.data;
        console.info(response.data);

        try {
          await message.reply({
            content: result.choices[0]?.text,
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
