import type { NextFunction, Request, Response } from "express"
import type { ZodType } from "zod"

// Valida `req.body` na fronteira e substitui-o pelo objecto já tipado, para
// que os controllers nunca recebam input cru.
export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        message: "Corpo do pedido inválido",
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      })
      return
    }

    req.body = result.data
    next()
  }
}
