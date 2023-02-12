import { getClient } from "./getClient";
import { ready } from "./ready";

export const startBot = async () => {
  console.info("Hello world");
  const client = getClient(process.env.DISCORD_BOT_TOKEN!);

  ready(client);
};
