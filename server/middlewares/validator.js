import validator from 'validator'

// check if input fields are empty or not.
const validateRegisterFields = (req, res, next) => {
    const { name, email, password, about } = req.body;

    if (!name || !email || !password || !about || !req.file) {
        return res.status(400).json({ success: false, message: "All fields (name, email, password, about, avatar) are required." });
    }
    if (!validator.isEmail(email))
        return res.json({ success: false, message: "Please enter a valid email" })
    if (password.length < 6)
        return res.json({ success: false, message: "Please enter a strong password" })
    next();
};

const validateLoginFields = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields (email, password) are required." });
    }
    next();
};

export { validateRegisterFields, validateLoginFields }