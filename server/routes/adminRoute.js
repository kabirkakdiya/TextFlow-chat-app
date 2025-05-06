import express from 'express';
import { deleteMessage, getAllChats, getAllMessages, getAllUsers, getDashboardStats, getIsAdmin, loginAdmin, logoutAdmin } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/auth.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)

//routes where admin must be logged in
adminRouter.get("/", isAdmin, getIsAdmin)
adminRouter.get("/logout", isAdmin, logoutAdmin)
adminRouter.get("/users", isAdmin, getAllUsers);
adminRouter.get("/messages", isAdmin, getAllMessages);
adminRouter.get("/chats", isAdmin, getAllChats);
adminRouter.get("/stats", isAdmin, getDashboardStats);

adminRouter.delete("/messages/:messageId", isAdmin, deleteMessage);

export default adminRouter;