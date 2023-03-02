import { config as dotenvConfig } from 'dotenv-flow';
import { ConfigType } from './types';

dotenvConfig();

export const config: ConfigType = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'text-davinci-003',
    behavior:
      process.env.OPENAI_BEHAVIOR || 'friendly, helpful and professional',
    name: process.env.OPENAI_NAME || 'Davinci',
    temperature: process.env.OPENAI_TEMPERATURE
      ? Number(process.env.OPENAI_TEMPERATURE)
      : 0.8,
    maxTokens: process.env.OPENAI_MAX_TOKENS
      ? Number(process.env.OPENAI_MAX_TOKENS)
      : 1000,
    conversationalDepth: process.env.MAX_CONVERSATIONAL_DEPTH
      ? Number(process.env.OPENAI_CONVERSATIONAL_DEPTH)
      : 3,
  },
  autoRespondPrompts: process.env.RESPOND_PROMPTS
    ? process.env.RESPOND_PROMPTS.split(',').filter((val) => !!val?.trim())
    : [],
  respondDelay: process.env.RESPOND_DELAY
    ? Number(process.env.RESPOND_DELAY)
    : undefined,
  respondDelayTo: process.env.RESPOND_DELAY_TO,
  noLog: process.env.NO_LOG === 'true',
  botToken: process.env.DISCORD_BOT_TOKEN || '',
};
