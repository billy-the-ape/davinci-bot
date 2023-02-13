import { Client, GatewayIntentBits } from 'discord.js';

/* const thingsToDefaultCache = [
  "GuildChannelManager",
  "PermissionOverwriteManager",
  "RoleManager",
  "GuildManager",
  "ChannelManager",
  'GuildMemberManager',
]; */

/* const thingsToPartiallyCache: Partial<Record<keyof Caches, number>> = {
  GuildMemberManager: 500,
}; */

export const getClient = (token: string /* , includePartials = false */) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      /* GatewayIntentBits.GuildMembers,
      ...(includePresences || process.env.BOT_PRESENCE_INTENT === 'true'
        ? [GatewayIntentBits.GuildPresences]
        : []), */
    ],
    /* makeCache: (manager) => {
      if (thingsToPartiallyCache[manager.name]) {
        return new LimitedCollection({
          maxSize: thingsToPartiallyCache[manager.name],
        });
      } else if (thingsToDefaultCache.includes(manager.name))
        return new Collection();
      return new LimitedCollection({
        maxSize: 0,
      });
    },
    ...((includePartials || process.env.BOT_BACKGROUND === "true") && {
      partials: [Partials.GuildMember],
    }), */
    /* sweepers: {
      guildMembers: {
        interval: 10 * ONE_MINUTE,
        filter: (member) => {},
      },
    }, */
  });
  client.login(token);
  return client;
};

export const waitForReady = async (client: Client) => {
  if (client.isReady()) {
    return;
  }

  return new Promise<void>((resolve) => {
    (client as Client).on('ready', () => resolve());
  });
};
