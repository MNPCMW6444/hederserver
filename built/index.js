"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const heroku_ssl_redirect_1 = __importDefault(require("heroku-ssl-redirect"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const mmmRouter_1 = __importDefault(require("./routers/mmmRouter"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const memoryRouter_1 = __importDefault(require("./routers/memoryRouter"));
const responseRouter_1 = __importDefault(require("./routers/responseRouter"));
require("winston-mongodb");
const app = (0, express_1.default)();
const port = process.env.PORT || 6555;
dotenv_1.default.config();
let mainDbStatus = false;
const connectToDBs = () => {
    mongoose_1.default.connect("" + process.env.SAFE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err) => {
        if (err)
            return console.error(err);
        console.log("Connected to Main MongoDB");
        mainDbStatus = true;
    });
    if (!mainDbStatus)
        setTimeout(connectToDBs, 180000);
};
connectToDBs();
app.use((0, heroku_ssl_redirect_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.listen(port, () => console.log(`Server started on port: ${port}`));
app.use("/mmm", mmmRouter_1.default);
app.use("/user", userRouter_1.default);
app.use("/memory", memoryRouter_1.default);
app.use("/response", responseRouter_1.default);
app.get("/areyoualive", (_, res) => res.json({ answer: "yes" }));
