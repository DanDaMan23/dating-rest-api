import { Router } from "express"
import { signup } from "../controllers/auth"

const routes = Router()

routes.get("/signup", signup)

export default routes
