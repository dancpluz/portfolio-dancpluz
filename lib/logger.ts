import {
  configure,
  getConsoleSink,
  getLogger,
  getAnsiColorFormatter,
} from '@logtape/logtape';

const isProd = process.env.NODE_ENV === 'production';

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
    { category: ['client'], lowestLevel: isProd ? 'error' : 'debug', sinks: isProd ? [] : ['console'] },
    { category: ['server'], lowestLevel: isProd ? 'info' : 'debug', sinks: ['console'] },
  ],
});

export const clientLogger = getLogger(['client']);
export const serverLogger = getLogger(['server']);

export const transformLogger = getLogger(['server', 'transform']);
export const i18nLogger = getLogger(['server', 'i18n']);
export const uiLogger = getLogger(['client', 'ui']);
