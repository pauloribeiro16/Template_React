import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { env } from "../config/env.js"

// A forma do erro é o contrato com o frontend: o interceptor em
// `frontend/src/services/api.ts` lê `message`, `path` e `statusCode`.
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    message: "Rota não encontrada",
    path: req.originalUrl,
    statusCode: 404,
  })
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Dados inválidos",
      path: req.originalUrl,
      statusCode: 400,
    })
    return
  }

  // O stack só existe em desenvolvimento — nunca vazar stack em produção.
  if (env.NODE_ENV === "development") {
    console.error(error)
  }

  res.status(500).json({
    message: "Erro interno do servidor",
    path: req.originalUrl,
    statusCode: 500,
  })
}
