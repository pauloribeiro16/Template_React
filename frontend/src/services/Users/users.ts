import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/services/api"
import type { CreateUserInput, User } from "./types"

const usersKeys = {
  all: ["users"] as const,
  list: () => [...usersKeys.all, "list"] as const,
  detail: (id: string) => [...usersKeys.all, "detail", id] as const,
}

export const useFetchUsers = () => {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: async () => {
      return api.get("users").json<User[]>()
    },
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      return api.post("users", { json: input }).json<User>()
    },
    onSuccess: (data) => {
      toast.success(`Utilizador ${data.name} criado.`)
      queryClient.invalidateQueries({ queryKey: usersKeys.list() })
    },
    onError: (error) => {
      toast.error("Falha ao criar utilizador", {
        description: error.message || "Ocorreu um erro inesperado.",
      })
    },
  })
}
