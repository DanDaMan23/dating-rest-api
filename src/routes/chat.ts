import { Router } from "express"
import { check } from "express-validator"
import {
  chat,
  chats,
  newChat,
  reply,
  updateChatName
} from "../controllers/chat"
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

router.get("/:chatId", isAuth, chat)

router.get("/", isAuth, chats)

router.put(
  "/updateChatName",
  [
    check("chatId", "Chat Id is Required").notEmpty(),
    check("chatName", "Chatname is required").isLength({ min: 1 })
  ],
  isAuth,
  updateChatName
)

export default router
