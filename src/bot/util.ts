import { Client, Guild, TextChannel } from 'discord.js';
import { log } from '../log';

export const getChannel = async (client: Client, channelId?: string) => {
  if (!channelId || channelId === 'undefined') return null;

  try {
    const result = client.channels.cache.get(channelId);

    if (result) return result as TextChannel;

    return (await client.channels.fetch(channelId)) as TextChannel;
  } catch (e: any) {
    if (e.message === 'Unknown Channel' || e.message === 'Missing Access') {
      return null;
    }
    log(
      'An error occurred getting a channel',
      e.Message,
      JSON.stringify({ channelId })
    );
    // await logError("tsitsi", e, `bot-interface`, JSON.stringify({ channelId }));
    return null;
  }
};

export const getMember = async (guild: Guild, discordUserId?: string) => {
  if (!discordUserId) return null;

  try {
    const result = guild.members.cache.get(discordUserId);

    if (result) return result;

    return await guild.members.fetch(discordUserId);
  } catch (e: any) {
    if (e.message === 'Unknown Member') {
      return null;
    }
    log(
      'An error occurred getting a server member',
      e.Message,
      JSON.stringify({ guildId: guild.id, discordUserId })
    );
    return null;
  }
};

export const getMessage = async (channel: TextChannel, messageId?: string) => {
  if (!messageId) return null;

  const result = channel.messages.cache.get(messageId);
  if (result) {
    return result;
  }

  return await channel.messages.fetch(messageId);
};

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
