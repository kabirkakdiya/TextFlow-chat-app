import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import { userSocketIDs } from "../app.js";

export const connect_db = () => {
    mongoose.connect("mongodb://localhost:27017/chat_app_db")
        .then(() => console.log("Database Connected"))
        .catch((err) => {
            console.log(err);
        })
}

export const sendToken = (res, user, statusCode, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.status(statusCode).cookie("user-token", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        httpOnly: true,
        secure: true,
    }).json({
        success: true,
        user,    //user info sent for fetching data immediately after login
        message
    })
}

export const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io")
    const userSockets = getSockets(users)
    io.to(userSockets).emit(event, data)
}

//for one-to-one chat only(2 members)
export const getOtherMember = (members, userId) => {
    return members.find((member) => member.id.toString() !== userId.toString())
}

//to get socket ids of given individual users 
export const getSockets = (users = []) => {
    const sockets = users.map((userId) => userSocketIDs.get(userId.toString()))

    return sockets
}