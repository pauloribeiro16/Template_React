import { env } from "../config/env.js"

// Em produção só os erros passam: o stdout fica limpo para o agregador de logs.
const isDev = env.NODE_ENV === "development"

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args)
  },
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
}

export default logger
