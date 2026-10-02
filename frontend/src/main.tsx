import App from "@/containers/App/App"
import AllTheProviders from "@/containers/App/providers"
import { createRoot } from "react-dom/client"
import "./styles/index.css"

createRoot(document.getElementById("root")!).render(
  <AllTheProviders>
    <App />
  </AllTheProviders>,
)
