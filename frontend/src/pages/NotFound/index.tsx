import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

const NotFound = () => {
  const navigate = useNavigate()
  const handleReturn = () => navigate(-1)
  const handleReturnHome = () => navigate("/")

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
      <div>404</div>
      <div className="flex flex-row gap-3">
        <Button onClick={handleReturn}>
          <div className="text-white">Voltar</div>
        </Button>
        <Button onClick={handleReturnHome}>
          <div>Home</div>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
