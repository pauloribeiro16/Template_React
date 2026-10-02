import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// O Testing Library não faz auto-cleanup quando `globals` está desligado;
// com `globals: true` continuamos a precisar de o chamar à mão.
afterEach(() => {
  cleanup()
})
