import express from 'express';
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendMessageAttachments } from '../controllers/chatController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import multer from 'multer';

const chatRouter = express.Router();

// attachments storage
const storage = multer.diskStorage({
    destination: "messageAttachments",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})


//routes where user must be logged in first
chatRouter.post("/new", isAuthenticated, newGroupChat)

chatRouter.get("/my", isAuthenticated, getMyChats)

chatRouter.get("/my/groups", isAuthenticated, getMyGroups)

chatRouter.put("/add-members", isAuthenticated, addMembers)

chatRouter.put("/remove-member", isAuthenticated, removeMember)

chatRouter.delete("/leave/:chatId", isAuthenticated, leaveGroup)

//send attachments via post request
chatRouter.post('/message', isAuthenticated, multer({ storage }).array("files", 5), sendMessageAttachments)

//get messages
chatRouter.get("/message/:chatId", isAuthenticated, getMessages)

//get chat details, 
chatRouter.get("/:chatId", isAuthenticated, getChatDetails)
//delete chat/groupchat
chatRouter.delete("/:chatId", isAuthenticated, deleteChat)
//rename chat
chatRouter.put("/:chatId", isAuthenticated, renameGroup)

export default chatRouter;