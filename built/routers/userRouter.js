"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("../models/userModel"));
const requestForAccountModal_1 = __importDefault(require("../models/requestForAccountModal"));
const requestForPassChangeModal_1 = __importDefault(require("../models/requestForPassChangeModal"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const check_password_strength_1 = require("check-password-strength");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const signupreq_1 = __importDefault(require("../emailTemplates/signupreq"));
const passreset_1 = __importDefault(require("../emailTemplates/passreset"));
const router = express_1.default.Router();
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            res.status(400).json({ clientError: "Wrong email or password" });
        const existingUser = await userModel_1.default.findOne({ email });
        if (!existingUser)
            return res.status(401).json({
                clientError: "Wrong email or password",
            });
        const correctPassword = await bcryptjs_1.default.compare(password, existingUser.passwordHash);
        if (!correctPassword)
            return res.status(401).json({
                clientError: "Wrong email or password",
            });
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id,
        }, process.env.JWT_SECRET);
        res
            .cookie("jwt", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "development"
                ? "lax"
                : process.env.NODE_ENV === "production" && "none",
            secure: process.env.NODE_ENV === "development"
                ? false
                : process.env.NODE_ENV === "production" && true,
        })
            .send();
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ serverError: "Unexpected error occurred in the server" });
    }
});
router.post("/signupreq", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({
                clientError: "The email is missing",
            });
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                clientError: "An account with this email already exists",
            });
        const key = Math.floor(Math.random() * 1000000);
        const savedRequest = await new requestForAccountModal_1.default({
            //serialNumber: (await RequestForAccount.find()).length + 1,
            email,
            key,
        }).save();
        mail_1.default.setApiKey("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" // Very-Sensitive
        );
        const msg = {
            to: email,
            from: "service@neurobica.online",
            subject: "Please Activate your Neurobica account",
            html: (0, signupreq_1.default)(key),
        };
        mail_1.default
            .send(msg)
            .then(() => {
            console.log("Verification email sent");
        })
            .catch((error) => {
            console.error(error);
        });
        res.json({ result: "email successfully sent to " + email });
    }
    catch (err) {
        console.error(err);
        res.json({ result: "email successfully sent to " });
        res.status(500).json({
            serverError: "Unexpected error occurred in the server" + JSON.stringify(err),
        });
    }
});
router.post("/signupfin", async (req, res) => {
    try {
        const { email, key, fullname, password, passwordagain } = req.body;
        if (!email || !key || !fullname || !password || !passwordagain)
            return res.status(400).json({
                clientError: "At least one of the fields are missing",
            });
        const passStrength = (0, check_password_strength_1.passwordStrength)(password);
        if (passStrength.id < 2)
            return res.status(400).json({
                clientError: "Password isn't strong enough, the value is" +
                    (0, check_password_strength_1.passwordStrength)(password).value,
            });
        if (password !== passwordagain)
            return res.status(400).json({
                clientError: "Passwords doesn't match",
            });
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                clientError: "An account with this email already exists",
            });
        const existingKey = await requestForAccountModal_1.default.findOne({ key });
        if (!existingKey || existingKey.email !== email)
            return res.status(400).json({
                clientError: "The key is wrong",
            });
        const salt = await bcryptjs_1.default.genSalt();
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const savedUser = await new userModel_1.default({
            //serialNumber: (await User.find()).length + 1,
            deactivated: false,
            neurons: 0,
            notifications: false,
            newsletter: false,
            deleted: false,
            email,
            fullname,
            passwordHash,
        }).save();
        const token = jsonwebtoken_1.default.sign({
            id: savedUser._id,
        }, process.env.JWT_SECRET);
        res
            .cookie("jwt", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "development"
                ? "lax"
                : process.env.NODE_ENV === "production" && "none",
            secure: process.env.NODE_ENV === "development"
                ? false
                : process.env.NODE_ENV === "production" && true,
        })
            .send();
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ serverError: "Unexpected error occurred in the server" });
    }
});
router.get("/signedin", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res.status(401).json({ clientMessage: "Unauthorized" });
        const validatedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = validatedUser.id;
        res.json(await userModel_1.default.findById(userId));
    }
    catch (err) {
        return res.status(401).json({ errorMessage: "Unauthorized." });
    }
});
router.get("/signout", async (req, res) => {
    try {
        res
            .cookie("jwt", "", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "development"
                ? "lax"
                : process.env.NODE_ENV === "production" && "none",
            secure: process.env.NODE_ENV === "development"
                ? false
                : process.env.NODE_ENV === "production" && true,
            expires: new Date(0),
        })
            .send();
    }
    catch (err) {
        return res
            .status(500)
            .json({ errorMessage: "Server Error nichal todo api" });
    }
});
router.post("/passresreq", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({
                clientError: "The email is missing",
            });
        const existingUser = await userModel_1.default.findOne({ email });
        if (!existingUser)
            return res.status(400).json({
                clientError: "An account with this email couldn't been found",
            });
        const key = Math.floor(Math.random() * 1000000);
        const savedRequest = await new requestForPassChangeModal_1.default({
            //serialNumber: (await RequestForPassChange.find()).length + 1,
            email,
            key,
        }).save();
        mail_1.default.setApiKey("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" // Very-Sensitive
        );
        const msg = {
            to: email,
            from: "service@neurobica.online",
            subject: "Password Reset Request",
            html: (0, passreset_1.default)(key),
        };
        mail_1.default
            .send(msg)
            .then(() => {
            console.log("reset email sent");
        })
            .catch((error) => {
            console.error(error);
        });
        res.json({ result: "email successfully sent to " + email });
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ serverError: "Unexpected error occurred in the server" });
    }
});
router.post("/passresfin", async (req, res) => {
    try {
        const { email, key, password, passwordagain } = req.body;
        if (!email || !key || !password || !passwordagain)
            return res.status(400).json({
                clientError: "At least one of the fields are missing",
            });
        const passStrength = (0, check_password_strength_1.passwordStrength)(password);
        if (passStrength.id < 2)
            return res.status(400).json({
                clientError: "Password isn't strong enough, the value is" +
                    (0, check_password_strength_1.passwordStrength)(password).value,
            });
        if (password !== passwordagain)
            return res.status(400).json({
                clientError: "Passwords doesn't match",
            });
        const salt = await bcryptjs_1.default.genSalt();
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = (await userModel_1.default.find({ email }))[0];
        user.neurons = user.neurons | 0;
        user.deactivated = false;
        user.notifications = false;
        user.newsletter = false;
        user.deleted = false;
        user.passwordHash = passwordHash;
        await user.save();
        res.json({ changed: "yes" });
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ serverError: "Unexpected error occurred in the server" });
    }
});
router.post("/updaten", async (req, res) => {
    try {
        const { notifications, newsletter } = req.body;
        if ((notifications !== true && notifications !== false) ||
            (newsletter !== true && newsletter !== false))
            return res.status(400).json({
                clientError: "At least one of the fields are missing",
            });
        const token = req.cookies.jwt;
        if (!token)
            return res.status(401).json({ clientMessage: "Unauthorized" });
        const validatedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = validatedUser.id;
        const user = (await userModel_1.default.find({ userId }))[0];
        user.notifications = notifications;
        user.newsletter = newsletter;
        await user.save();
        res.json({ changed: "yes" });
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ serverError: "Unexpected error occurred in the server" });
    }
});
exports.default = router;
