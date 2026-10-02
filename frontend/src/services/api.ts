import { envConfig } from "@/config/env"
import ky, { HTTPError } from "ky"

// Formato de erro partilhado com o backend — ver
// `backend/src/middleware/error-handler.ts`.
type ApiErrorBody = {
  message: string
  path: string
  statusCode: number
}

const baseApi = ky.create({
  prefixUrl: envConfig.VITE_BASE_URL,
})

// Normaliza o erro da API para que os consumidores só precisem de ler
// `error.message`, sem conhecer o formato do ky.
const errorInterceptor = async (error: HTTPError) => {
  const body = (await error.response.json()) as ApiErrorBody
  error.name = `${body.statusCode} - ${body.path}`
  error.message = body.message

  return error
}

export const api = baseApi.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        // Quando houver autenticação, o token entra por aqui. Nunca ler de
        // localStorage noutro sítio.
        const token: string | null = null
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`)
        }
      },
    ],
    beforeError: [errorInterceptor],
  },
})
