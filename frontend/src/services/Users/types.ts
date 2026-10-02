export type User = {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export type CreateUserInput = {
  email: string
  name: string
}
