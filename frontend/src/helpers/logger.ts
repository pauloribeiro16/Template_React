import { envConfig } from "@/config/env"

// Erros passam sempre; o resto só em desenvolvimento, para o build de produção
// não encher a consola.
const logger = {
  log: (...args: unknown[]) => {
    if (envConfig.DEV) console.log(...args)
  },
  info: (...args: unknown[]) => {
    if (envConfig.DEV) console.info(...args)
  },
  warn: (...args: unknown[]) => {
    if (envConfig.DEV) console.warn(...args)
  },
  error: (...args: unknown[]) => {
    console.error(...args)
  },
  trace: (...args: unknown[]) => {
    if (envConfig.DEV) console.trace(...args)
  },
}

export default logger
