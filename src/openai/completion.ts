import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

export const createCompletion = async (prompt: string, stop: string[] = []) => {
  return await openai.createCompletion({
    model: process.env.OPENAI_MODEL!,
    prompt,
    temperature: 0.8,
    max_tokens: 1000,
    stop,
  });
};
