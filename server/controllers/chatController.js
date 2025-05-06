import { NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from '../constants/events.js';
import chatModel from '../models/chatModel.js';
import messageModel from '../models/messageModel.js';
import userModel from '../models/userModel.js';
import { emitEvent, getOtherMember } from '../utils/features.js';
import { promises as fs } from 'fs'

const newGroupChat = async (req, res) => {
    const { groupName, members } = req.body; //getting group name and members from req.body

    try {
        if (members.length < 2) {
            return res.status(400).json({ success: false, message: "Group chat must have atleast 3 members" })
        }

        const allMembers = [...members, req.userId];

        await chatModel.create({
            name: groupName,
            groupChat: true,
            creator: req.userId,
            members: allMembers
        });

        emitEvent(req, REFETCH_CHATS, allMembers)

        return res.status(200).json({
            success: true,
            message: "Group Created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }

}


const getMyChats = async (req, res) => {
    try {
        const chats = await chatModel.find({ members: req.userId }).populate("members", "name avatar") //return array of chats

        const transformedChats = chats.map(({ _id, groupChat, members, name }) => {

            const otherMember = getOtherMember(members, req.userId); //works when only groupchat is false so one-to-one chat is there.

            return {
                _id: _id,
                groupChat: groupChat,
                avatar: groupChat ? members.slice(0, 3).map((member) => member.avatar) : [otherMember.avatar], //array only because I have done mapping in frontend, considering that avatar will be an array only.
                name: groupChat ? name : otherMember.name,
                members: members
                    .filter((member) => member.id.toString() !== req.userId.toString())
                    .map((member) => member.id)              //first removes those objects that match req.userId and then returns the Ids from the remaining objects as an array.
            }
        })

        return res.status(200).json({
            success: true,
            chats: transformedChats
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getMyGroups = async (req, res) => {   //gets those groups whose creator is the req.userId
    try {
        const chats = await chatModel.find({
            members: req.userId,
            groupChat: true,
            creator: req.userId
        }).populate("members", "name avatar")

        const transformedGroups = chats.map(({ _id, groupChat, members, name }) => {
            return {
                _id: _id,
                groupChat: groupChat,
                name: name,
                avatar: members.slice(0, 3).map((member) => member.avatar)
            }
        })

        return res.status(200).json({
            success: true,
            groups: transformedGroups
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}


const addMembers = async (req, res) => {
    const { chatId, membersToAdd } = req.body;   //array of userIds to be added
    if (!membersToAdd || membersToAdd.length < 1)
        return res.status(400).json({ success: false, message: "Please provide members" })

    try {
        const chat = await chatModel.findById(chatId)
        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found" })
        if (!chat.groupChat)
            return res.status(400).json({ success: false, message: "This is not a Group chat" })
        if (chat.creator.toString() !== req.userId.toString())
            return res.status(403).json({ success: false, message: "You are not allowed to add members" })

        const allMembers = [...chat.members, ...membersToAdd]
        const uniqueMembers = allMembers.filter(memberId => !chat.members.includes(memberId.toString()))

        chat.members.push(...uniqueMembers);

        if (chat.members.length > 100)
            return res.status(400).json({ success: false, message: "Group member limit reached" })

        await chat.save();

        emitEvent(req, REFETCH_CHATS, chat.members)
        return res.status(200).json({
            success: true,
            message: "Members added successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const removeMember = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const chat = await chatModel.findById(chatId);
        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found." })
        if (!chat.groupChat)
            return res.status(400).json({ success: false, message: "This is not a Group chat" })
        if (chat.members.length <= 3)
            return res.status(400).json({ success: false, message: "Group must have atleast 3 members" })


        // before updating members get ids of all members(including removed one)
        const allChatMemberIds = chat.members.map(memberId => memberId.toString())

        //remaining members updated
        chat.members = chat.members.filter((memberId) => memberId.toString() !== userId.toString())
        await chat.save();

        emitEvent(req, REFETCH_CHATS, allChatMemberIds);

        return res.status(200).json({ success: true, message: "Member removed successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const leaveGroup = async (req, res) => {
    try {
        const chat = await chatModel.findById(req.params.chatId);
        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found." })
        if (!chat.groupChat)
            return res.status(400).json({ success: false, message: "This is not a Group chat" })

        const remainingMembers = chat.members.filter((memberId) => memberId.toString() !== req.userId.toString());
        if (remainingMembers.length < 3)
            return res.status(400).json({ success: false, message: "Group must have atleast 3 members" })

        if (chat.creator.toString() === req.userId.toString()) { //if group creator leaves the group, new member becomes the creator
            const newCreator = remainingMembers[0];
            chat.creator = newCreator;
        }

        chat.members = remainingMembers;
        await chat.save();

        return res.status(200).json({ success: true, message: "Group Left Successfully", });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

const getChatDetails = async (req, res) => {
    try {
        const chat = await chatModel.findById(req.params.chatId).populate("members", "name avatar")
        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found." })

        return res.status(200).json({ success: true, chat })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" });
    }
}

const deleteChat = async (req, res) => {
    try {
        const chat = await chatModel.findById(req.params.chatId)
        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found." })
        if (chat.groupChat && chat.creator.toString() !== req.userId.toString())
            return res.status(403).json({ success: false, message: "You are not allowed to delete the group" })
        if (!chat.groupChat && !chat.members.includes(req.userId.toString()))
            return res.status(403).json({ success: false, message: "You are not allowed to delete the chat" })

        // deleting attachments from local storage
        const messagesWithAttachments = await messageModel.find({
            chat: req.params.chatId,      //as per chatId
            attachments: { $exists: true, $ne: [] }    //where attachment exists as well as is not an empty array
        })

        const attachmentsToBeDeleted = []

        messagesWithAttachments.forEach(({ attachments }) => {
            attachmentsToBeDeleted.push(...attachments)
        })

        if (attachmentsToBeDeleted.length > 0) {        // map returns array of unresolved promises(pending)
            await Promise.all(                          // promise.all waits for them to resolve
                attachmentsToBeDeleted.map(attch => fs.unlink(`messageAttachments/${attch}`))
            );
            console.log("attachments deleted")
        }

        await chatModel.findByIdAndDelete(req.params.chatId);
        await messageModel.deleteMany({ chat: req.params.chatId })

        emitEvent(req, REFETCH_CHATS, chat.members);
        if (chat.groupChat)
            return res.status(200).json({ success: true, message: "Group deleted successfully" })
        else
            return res.status(200).json({ success: true, message: "Chat deleted successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" });
    }
}

const getMessages = async (req, res) => {
    try {
        const chat = await chatModel.findById(req.params.chatId);
        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found" })
        if (!chat.members.includes(req.userId.toString()))
            return res.status(403).json({ success: false, message: "You are not allowed to access this chat" })

        const messages = await messageModel
            .find({ chat: req.params.chatId })
            .sort({ createdAt: 1 }) // sorts messages from oldest to newest.
            .populate("sender", "name")

        return res.status(200).json({
            success: true,
            messages: messages,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" });
    }
}

const renameGroup = async (req, res) => {
    const chatId = req.params.chatId;
    if (!req.body.name)
        return res.status(400).json({ success: false, message: "Please enter New name for the group" })
    const newName = req.body.name;

    try {
        const chat = await chatModel.findById(chatId);
        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found" })
        if (!chat.groupChat)
            return res.status(400).json({ success: false, message: "This is not a Group chat" })
        if (chat.creator.toString() !== req.userId.toString())
            return res.status(403).json({ success: false, message: "You are not allowed to rename the group" })

        chat.name = newName;  //changing the name
        await chat.save()

        emitEvent(req, REFETCH_CHATS, chat.members);

        return res.status(200).json({ success: true, message: "Group renamed successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" });
    }
}

const sendMessageAttachments = async (req, res) => {
    const chatId = req.body.chatId;
    if (req.files.length < 1)
        return res.status(400).json({ success: false, message: "No attachments uploaded" })

    try {
        const chat = await chatModel.findById(chatId)
        const senderUser = await userModel.findById(req.userId, "name")

        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found" })

        const attachments = req.files.map(fileObj => fileObj.filename)

        const messageForDB = {
            content: "",
            attachments,
            sender: senderUser._id,
            chat: chat._id
        }

        const messageForRealTime = {
            ...messageForDB,
            _id: Date.now(),
            sender: {
                _id: senderUser._id,
                name: senderUser.name
            },
            createdAt: new Date().toISOString()
        }
        const message = await messageModel.create(messageForDB)

        emitEvent(req, NEW_MESSAGE, chat.members, {
            message: messageForRealTime,
            chatId
        })

        emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId })

        return res.status(200).json({ success: true, message: message })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" });
    }
}
export {
    addMembers, deleteChat, getChatDetails, getMessages, getMyChats,
    getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup,
    sendMessageAttachments
};