import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { describe, expect, it } from "vitest"
import NotFound from "./index"

function renderNotFound() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  )
}

describe("NotFound", () => {
  it("mostra o código 404", () => {
    renderNotFound()
    expect(screen.getByText("404")).toBeInTheDocument()
  })

  it("tem um botão para voltar atrás", async () => {
    const user = userEvent.setup()
    renderNotFound()

    await user.click(screen.getByRole("button", { name: /voltar/i }))

    // `navigate(-1)` sem histórico não rebenta — o smoke test é não crashar.
    expect(screen.getByText("404")).toBeInTheDocument()
  })
})
