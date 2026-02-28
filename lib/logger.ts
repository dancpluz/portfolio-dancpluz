import { configure, getConsoleSink, getLogger, getAnsiColorFormatter } from "@logtape/logtape";

await configure({
  sinks: { 
    console: getConsoleSink({
      formatter: getAnsiColorFormatter({
        timestamp: (ts) => {
          return new Date(ts).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          }).replace(',', '');
        }
      })
    }) 
  },
  loggers: [
    { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"] },
    { category: ["portfolio"], lowestLevel: "debug", sinks: ["console"] }
  ]
});

const logger = getLogger(["portfolio"]);

export default logger;
