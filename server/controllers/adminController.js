import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";
import messageModel from "../models/messageModel.js";
import jwt from "jsonwebtoken";
import { promises as fs } from 'fs'

const loginAdmin = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Please enter username and password" })
    }
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: "Invalid Credentials" })
    }
    try {
        const token = jwt.sign(username, process.env.JWT_SECRET)

        return res.status(200).cookie("admin-token", token, {
            maxAge: 1000 * 60 * 30,     // 30 minutes
            sameSite: "none",
            httpOnly: true,
            secure: true,
        }).json({
            success: true,
            message: "Admin Authentication successful. Welcome back Admin"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const logoutAdmin = async (req, res) => {
    try {
        return res.status(200).cookie("admin-token", "", {
            maxAge: 0,
            sameSite: "none",
            httpOnly: true,
            secure: true,
        }).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getIsAdmin = (req, res) => {
    return res.status(200).json({
        admin: true
    })
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        const transformedUsers = []
        for (const user of users) {

            const groups = await chatModel.countDocuments({ groupChat: true, members: user._id })
            const friends = await chatModel.countDocuments({ groupChat: false, members: user._id }) //counting those chat means the friends will be equal to number of one-to-one chats.

            transformedUsers.push({
                _id: user._id,
                name: user.name,
                avatar: user.avatar,
                email: user.email,
                friends: friends,
                groups: groups
            })
        }
        return res.status(200).json({ success: true, users: transformedUsers })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getAllChats = async (req, res) => {
    try {
        const chats = await chatModel.find({}).populate("creator", "name")

        const transformedChats = [];
        for (const chat of chats) {
            const totalMessages = await messageModel.countDocuments({ chat: chat._id })
            transformedChats.push({
                _id: chat._id,
                name: chat.name,
                groupChat: chat.groupChat,
                creator: chat.creator?.name || "None",
                totalMessages,
                totalMembers: chat.members.length,
            })
        }
        return res.status(200).json({ success: true, chats: transformedChats })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getAllMessages = async (req, res) => {
    try {
        const messages = await messageModel.find({}).populate("sender", "name")

        const transformedMessages = messages.map(({ _id, content, sender, createdAt }) => {
            return {
                _id,
                content,
                sender,
                createdAt
            }
        })

        return res.status(200).json({ success: true, messages: transformedMessages })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getDashboardStats = async (req, res) => {
    try {
        const messagesCount = await messageModel.countDocuments()
        const chatsCount = await chatModel.countDocuments()
        const usersCount = await userModel.countDocuments()

        const stats = {
            usersCount,
            chatsCount,
            messagesCount
        }
        return res.status(200).json({ success: true, stats })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const deleteMessage = async (req, res) => {
    try {
        const message = await messageModel.findById(req.params.messageId)
        if (!message)
            return res.status(404).json({ success: false, message: "Message not found" })
        if (message.attachments) {
            await Promise.all(                          // promise.all waits for them to resolve
                message.attachments.map(attch => fs.unlink(`messageAttachments/${attch}`))
            );
            console.log("attachments deleted")
        }
        await messageModel.findByIdAndDelete(req.params.messageId)
        return res.status(200).json({ success: true, message: "Message deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

export {
    getAllUsers,
    getAllMessages,
    getAllChats,
    getDashboardStats,
    logoutAdmin,
    loginAdmin,
    getIsAdmin,
    deleteMessage
}