import pino, { LoggerOptions } from 'pino';

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToSeverityLookup = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

const defaultPinoConf: LoggerOptions = {
  messageKey: 'message',
  formatters: {
    level(label, number) {
      return {
        severity:
          PinoLevelToSeverityLookup[label as keyof typeof PinoLevelToSeverityLookup] ||
          PinoLevelToSeverityLookup['info'],
        level: number,
      };
    },
  },
};

export const createLogger = () => {
  const logger = pino(defaultPinoConf);
  return logger;
};
