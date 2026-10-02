import { describe, expect, it } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("junta classes", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4")
  })

  it("deixa a última prevailecer quando colidem", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("ignora valores falsos", () => {
    const isHidden = false
    expect(cn("px-2", isHidden && "hidden", undefined, "text-sm")).toBe(
      "px-2 text-sm",
    )
  })
})
