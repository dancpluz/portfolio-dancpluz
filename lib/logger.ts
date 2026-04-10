import {
  configure,
  getConsoleSink,
  getLogger,
  getAnsiColorFormatter,
} from '@logtape/logtape';

await configure({
  sinks: {
    console: getConsoleSink({
      formatter: getAnsiColorFormatter({
        timestamp: (ts) => {
          return new Date(ts)
            .toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              fractionalSecondDigits: 3,
            })
            .replace(',', '');
        },
      }),
    }),
  },
  loggers: [
    {
      category: ['logtape', 'meta'],
      lowestLevel: 'warning',
      sinks: ['console'],
    },
    { category: ['client'], lowestLevel: 'debug', sinks: ['console'] },
    { category: ['server'], lowestLevel: 'debug', sinks: ['console'] },
  ],
});

export const clientLogger = getLogger(['client']);
export const serverLogger = getLogger(['server']);

// Child loggers for granular categorization (inherit parent level/sinks)
export const transformLogger = getLogger(['server', 'transform']);
export const i18nLogger = getLogger(['server', 'i18n']);
export const uiLogger = getLogger(['client', 'ui']);
