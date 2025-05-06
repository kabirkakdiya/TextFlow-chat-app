export const sampleChats = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Kabir",
        _id: "1",
        groupChat: false,
        members: ["1", "2"] //ids of chat members
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Meet",
        _id: "2",
        groupChat: false,
        members: ["1", "2"] //ids of chat members
    },
];

export const sampleUsers = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Kabir",
        _id: "1"
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Meet",
        _id: "2"
    },
]

export const sampleNotifications = [
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "Kabir"
        },
        _id: "1",
    },
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "Meet"
        },
        _id: "2",
    },
]

export const sampleMessage = [
    {
        content: "Hey, how are you?",
        _id: "mongodbid1", //unique id of each msg
        sender: {
            _id: "user._id",
            name: "Meet",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:01:22.650Z"
    },
    {
        content: "I am fine, and you?",
        _id: "mongodbid2", //unique id of each msg
        sender: {
            _id: "3",
            name: "Devam",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:01:22.650Z"
    }
]

export const sampleDashboardData = {
    users: [
        {
            name: "Kabir",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            _id: "1", //from database, unique id of user
            username: "kabir",
            friends: 10,
            groups: 2,
        },
        {
            name: "Tushar",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            _id: "2", //from database, unique id of user
            username: "tushar",
            friends: 24,
            groups: 3,
        },
    ],

    chats: [
        {
            name: "Friends talk",
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            _id: "1",  //from database, unique id of chat,
            groupChat: false,
            members: ["1", "2"], //unique id of members from database.
            totalMembers: 2,
            totalMessages: 58,
            creator: {
                name: "Tushar"
            }
        },
        {
            name: "BCA group",
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            _id: "2",  //from database, unique id of chat,
            groupChat: true,
            members: ["1", "2", "4", "66"], //unique id of members from database.
            totalMembers: 4,
            totalMessages: 30,
            creator: {
                name: "Kabir"
            }
        }
    ],

    messages: [
        {
            content: "How are you?",
            _id: "61",
            sender: {
                _id: "user._id",
                name: "Kabir",
            },
            createdAt: "2024-02-12T10:41:30.630Z",
        },
        {
            content: "I am currently doing my homework.",
            _id: "32",
            sender: {
                _id: "user._id",
                name: "Meet",
            },
            createdAt: "2025-01-22T08:24:49.630Z",
        }
    ]
}