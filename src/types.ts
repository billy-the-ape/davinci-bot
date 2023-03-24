export type ConfigType = {
  openai: {
    apiKey: string;
    model: string;
    behavior: string;
    name: string;
    temperature: number;
    maxTokens: number;
    conversationalDepth: number;
  };
  autoRespondPrompts: string[];
  respondDelay: number | undefined;
  respondDelayTo: string | undefined;
  noLog: boolean;
  botToken: string;
};

export type ChatCompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};
