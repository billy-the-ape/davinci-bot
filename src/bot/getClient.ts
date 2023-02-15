import { Client, GatewayIntentBits } from 'discord.js';

export const getClient = (token: string /* , includePartials = false */) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
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
