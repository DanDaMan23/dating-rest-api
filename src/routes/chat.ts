import { Router } from "express"
import { newChat } from "../controllers/chat"
import { isAuth } from "../middleware/is-auth"

const router = Router()

router.post("/newChat", isAuth, newChat)

router.put("/reply")

router.get("chat/:chatId")

export default router
