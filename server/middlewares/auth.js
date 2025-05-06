import jwt from 'jsonwebtoken'

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies["user-token"];

    if (!token) {
        return res.status(401).json({ success: false, message: "Please login first" })
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData._id;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}

export const isAdmin = (req, res, next) => {
    const token = req.cookies["admin-token"];

    if (!token) {
        return res.status(401).json({ success: false, message: "You need to login as Admin first." })
    }

    try {
        const adminUsername = jwt.verify(token, process.env.JWT_SECRET);
        if (process.env.ADMIN_USERNAME !== adminUsername) {
            return res.status(401).json({ success: false, message: "Only admin can access this route." })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred" })
    }
}