import { Router } from "express"
import { signup } from "../controllers/auth"

const routes = Router()

routes.post("/signup", signup)

export default routes
