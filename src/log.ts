import { config } from './config';

export const log = (...args: any[]) => {
  if (!config.noLog) {
    console.info(...args);
  }
};
