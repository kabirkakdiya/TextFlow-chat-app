import express from 'express'
import { connect_db, getSockets } from './utils/features.js';
import 'dotenv/config.js'
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { createServer } from 'http'
import cors from 'cors'
import jwt from 'jsonwebtoken';
import cookie from 'cookie'

import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import userRouter from './routes/userRoute.js';
import chatRouter from './routes/chatRoute.js';
import adminRouter from './routes/adminRoute.js';
import userModel from './models/userModel.js';
import messageModel from './models/messageModel.js';
import { isAuthenticated } from './middlewares/auth.js';


//app config
const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
})

app.set("io", io)

const port = 4000
const userSocketIDs = new Map(); //contains all currently active users

//middleware
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

//db connection
connect_db();

//api endpoints
app.use('/user', userRouter)
app.use('/user/avatar', isAuthenticated, express.static('./uploads'))
app.use('/chat', chatRouter)
app.use('/admin', adminRouter)

app.use('/message/attachment', isAuthenticated, express.static('./messageAttachments'))

app.get('/', (req, res) => {
    res.send("API working")
})

//socket io
io.use(async (socket, next) => {
    console.log(`cookie-value: ${socket.handshake.headers.cookie}`)
    if (!socket.handshake.headers.cookie) {
        socket.emit("auth_error", { success: false, message: "Please login first - 1 " })
        return;
    }

    const cookies = cookie.parse(socket.handshake.headers.cookie)
    console.log('\nCookies object after parsing: ', cookies)
    const token = cookies["user-token"]

    if (!token) {
        socket.emit("auth_error", { success: false, message: "Please login first - 2" })
        return;
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedData._id)
        if (!user) {
            socket.emit("auth_error", { success: false, message: "Invalid user" })
            return;
        }
        socket.user = user;
        return next();
    } catch (error) {
        socket.emit("auth_error", { success: false, message: "Error occurred" })
        return;
    }
})

io.on('connection', (socket) => {
    const user = socket.user
    userSocketIDs.set(user._id.toString(), socket.id)
    console.log(userSocketIDs);

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        const messageForRealTime = { //to be used for communication
            _id: Date.now(),
            content: message,
            sender: {
                _id: user._id,
                name: user.name
            },
            chat: chatId,
            createdAt: new Date().toISOString()
        }
        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId
        }

        const memberSockets = getSockets(members) //get socketIds of members to whom message is to be sent.
        console.log(memberSockets);

        io.to(memberSockets).emit(NEW_MESSAGE, {
            chatId, message: messageForRealTime
        });
        io.to(memberSockets).emit(NEW_MESSAGE_ALERT, { chatId });

        try {
            await messageModel.create(messageForDB);
        } catch (error) {
            throw new Error(error);
        }
    })

    socket.on('disconnect', () => {
        console.log("User disconnected.");
        userSocketIDs.delete(user._id.toString())
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})


export { userSocketIDs }
