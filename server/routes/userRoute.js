import express from 'express'
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, loginUser, logoutUser, registerUser, searchUser, sendFriendRequest } from '../controllers/userController.js';
import multer from 'multer';
import { isAuthenticated } from '../middlewares/auth.js';
import { validateLoginFields, validateRegisterFields } from '../middlewares/validator.js';

const userRouter = express.Router();

//Avatar storage
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, callback) => {
        return callback(null, `${Date.now()}${file.originalname}`)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jfif') {
        cb(null, true)
    } else {
        cb(null, false);
    }
}

//Using above configured storage to create a middleware
const upload = multer({
    storage, fileFilter, limits: {
        files: 1,                      //1 file per request
        fileSize: 1024 * 1024 * 2     //2MB limit
    }
})

//Adding this middleware on '/user/register' route
userRouter.post("/register", upload.single("avatar"), validateRegisterFields, registerUser);
userRouter.post("/login", validateLoginFields, loginUser);

//routes where user must be logged in first
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/profile", isAuthenticated, getMyProfile);
userRouter.get("/search", isAuthenticated, searchUser);

userRouter.put("/send-request", isAuthenticated, sendFriendRequest);
userRouter.put("/accept-request", isAuthenticated, acceptFriendRequest);

userRouter.get("/notifications", isAuthenticated, getMyNotifications)
userRouter.get("/friends", isAuthenticated, getMyFriends)
export default userRouter;