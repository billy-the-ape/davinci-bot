import { Client, Message } from "discord.js";
import { createCompletion } from "../../openai";
import { getMember } from "../util";

const TWO_SPACE_REG = /  /g;
const TICKET_TOOL_ID = "557628352828014614";
const TICKET_TOOL_USERID_REG = /^\<@([0-9]*)\>/;
const TICKET_TOOL_MESSAGE_PARSER = /`(.*)`/;

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
    const reg = new RegExp(testIds.join("|"), "g");
    if (mentioned || reg.test(message.content)) {
      console.log("AT ME DAWG");
      await message.channel.sendTyping();

      let pingUser = "";
      let questionContent = message.content
        .replace(reg, "")
        .replace(TWO_SPACE_REG, "");

      if (message.member?.user.id === TICKET_TOOL_ID) {
        const desc = message.embeds[1]?.description;
        console.log({ desc });
        if (desc) {
          const contentExec = TICKET_TOOL_MESSAGE_PARSER.exec(desc);
          if (contentExec) {
            questionContent = contentExec[1];
          }

          const userExec = TICKET_TOOL_USERID_REG.exec(message.content);
          if (userExec) {
            pingUser = `<@${userExec[1]}>`;
          }
        }
      }

      const response = await createCompletion(questionContent);

      const result = response.data;
      console.log(response.data);

      await message.reply({
        content: (pingUser ? pingUser + " " : "") + result.choices[0]?.text,
      });
    }
  };
