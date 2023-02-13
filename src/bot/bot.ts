import { getClient } from "./getClient";
import { ready } from "./ready";

export const startBot = async () => {
  console.info("Bot starting...");
  const client = getClient(process.env.DISCORD_BOT_TOKEN!);

  ready(client);
};
