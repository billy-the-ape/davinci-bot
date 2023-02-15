export type ConfigType = {
  openai: {
    apiKey: string;
    model: string;
    behavior: string;
    name: string;
    temperature: number;
    maxTokens: number;
  };
  autoRespondPrompts: string[];
  noLog: boolean;
  botToken: string;
};
