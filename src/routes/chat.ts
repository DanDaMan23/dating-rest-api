import { Router } from "express"
import { check } from "express-validator"
import { newChat, reply } from "../controllers/chat"
import { isAuth } from "../middleware/is-auth"

const router = Router()

router.post(
  "/newChat",
  isAuth,
  [
    check("toUserId", "User Id Required").notEmpty(),
    check("message", "Message must be 5 character long").isLength({ min: 5 })
  ],
  newChat
)

router.put(
  "/reply",
  isAuth,
  [
    check("message", "Message must be 5 character long").isLength({ min: 5 }),
    check("chatId", "Chat Id Required").notEmpty()
  ],
  reply
)

router.get("chat/:chatId")

export default router
