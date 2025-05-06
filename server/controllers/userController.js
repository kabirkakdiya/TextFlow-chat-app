import userModel from "../models/userModel.js";
import { emitEvent, getOtherMember, sendToken } from "../utils/features.js";
import chatModel from "../models/chatModel.js";
import requestModel from "../models/requestModel.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";

//create new user and store it in database and also save jwt in cookie
const registerUser = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Please provide an image" })
    }
    const avatar = `${req.file.filename}`
    const { name, about, email, password } = req.body;

    try {
        const exists = await userModel.findOne({ email })
        if (exists) { // checking if user is already registered or not.
            return res.status(400).json({ success: false, message: "User already exists. Please enter another email" })
        }

        const user = await userModel.create({
            name,
            about,
            email,
            password,
            avatar
        })

        sendToken(res, user, 201, "User registered successfully.");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

//login user and create and send token
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email })

        if (!user)
            return res.status(404).json({ success: false, message: "User not found." })
        if (user.password !== password)
            return res.status(401).json({ success: false, message: "Invalid Credentials" })

        sendToken(res, user, 200, `Welcome back ${user.name}`)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getMyProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user)
            return res.status(404).json({ success: false, message: "User not found." })

        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const logoutUser = (req, res) => {
    try {
        return res.status(200).cookie("user-token", "", {
            maxAge: 0,
            sameSite: "none",
            httpOnly: true,
            secure: true,
        }).json({ success: true, message: "Logged out successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}
const searchUser = async (req, res) => {
    const searchName = req.query.name || ""; //input as search query because not mandatory for user to give name
    try {
        // finding All my one-to-one chats
        const myChats = await chatModel.find({ groupChat: false, members: req.userId })

        //extracting users ids from them as friends array
        const myFriends = [];
        myChats.forEach((chat) => {
            myFriends.push(...chat.members)
        })

        //finding all users except those friend ids and as per the searched Name
        const allUsersExceptMyFriends = await userModel.find({
            _id: { $nin: [...myFriends, req.userId] },
            name: { $regex: searchName, $options: "i" }
        }, { name: 1, avatar: 1 })

        return res.status(200).json({ success: true, users: allUsersExceptMyFriends })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const sendFriendRequest = async (req, res) => {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ success: false, message: "Please enter a userID" })

    try {
        const request = await requestModel.findOne({
            $or: [{ sender: req.userId, receiver: receiverId },
            { sender: receiverId, receiver: req.userId }]
        })
        if (request)
            return res.status(400).json({ success: false, message: "Request already sent" })

        await requestModel.create({
            sender: req.userId, //requesting user
            receiver: receiverId
        });

        emitEvent(req, NEW_REQUEST, [receiverId]); //as the function accepts users as array
        return res.status(200).json({ success: true, message: "Friend Request Sent" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const acceptFriendRequest = async (req, res) => {
    const { requestId, acceptStatus } = req.body;
    if (!requestId)
        return res.status(400).json({ success: false, message: "Please enter request ID and accept status" })
    if (typeof acceptStatus !== "boolean")
        return res.status(400).json({ success: false, message: "acceptStatus must be a boolean value(true/false)" })

    try {
        const request = await requestModel.findById(requestId).populate("sender", "name").populate("receiver", "name");
        if (!request)
            return res.status(404).json({ success: false, message: "Request Not found" })
        if (request.receiver._id.toString() !== req.userId.toString())
            return res.status(401).json({ success: false, message: "You are not allowed to accept this request." })

        if (!acceptStatus) {
            await requestModel.findByIdAndDelete(requestId);
            return res.status(200).json({
                success: true,
                message: "Friend Request Rejected",
            })
        }

        const chatMembers = [request.sender._id, request.receiver._id];
        await chatModel.create({
            name: `${request.sender.name} and ${request.receiver.name}`,
            members: chatMembers
        })
        await requestModel.findByIdAndDelete(requestId);

        emitEvent(req, REFETCH_CHATS, chatMembers)

        return res.status(200).json({
            success: true,
            message: "Friend Request Accepted",
            senderId: request.sender._id
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getMyNotifications = async (req, res) => { //show user's friend requests sent to him
    try {
        const requests = await requestModel.find({ receiver: req.userId }).populate("sender", "name avatar") //only sender's name is needed.

        return res.status(200).json({ success: true, requests })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getMyFriends = async (req, res) => { //show user's friend requests sent to him
    const chatId = req.query.chatId;   //group chat Id
    try {
        const chats = await chatModel.find({ members: req.userId, groupChat: false }).populate("members", "name avatar")
        const friends = chats.map((chat) => {
            const otherUser = getOtherMember(chat.members, req.userId)
            return {
                _id: otherUser._id,
                name: otherUser.name,
                avatar: otherUser.avatar
            }
        })

        if (chatId) {
            const chat = await chatModel.findById(chatId);
            if (!chat.groupChat)
                return res.status(400).json({ success: false, message: "This is not a Group chat" })
            const availableFriends = friends.filter(friend => !chat.members.includes(friend._id))     // show those friends which are not added in the group.

            return res.status(200).json({ success: true, availableFriends })
        } else {
            return res.status(200).json({ success: true, friends })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

export { loginUser, registerUser, getMyProfile, logoutUser, searchUser, sendFriendRequest, getMyNotifications, acceptFriendRequest, getMyFriends }