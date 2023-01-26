"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const memoryResult_1 = __importDefault(require("../models/memoryResult"));
const router = express_1.default.Router();
router.post("/save", async (req, res) => {
    try {
        const { score } = req.body;
        const token = req.cookies.jwt;
        if (!token)
            return res.status(401).json({ clientMessage: "Unauthorized" });
        if (score === undefined)
            return res.status(400).json({ clientMessage: "No Result" });
        const validatedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = validatedUser.id;
        const newMemoryResult = new memoryResult_1.default({
            owner: userId,
            result: score,
        });
        const savedMemoryResult = await newMemoryResult.save();
        res.json(savedMemoryResult);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ serverError: "Unexpected error occurred in the server" });
    }
});
router.get("/getScores", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res.status(401).json({ clientMessage: "Unauthorized" });
        const validatedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = validatedUser.id;
        const memories = await memoryResult_1.default.find();
        res.json(memories.filter((resp) => resp.owner.toString() === userId));
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ serverError: "Unexpected error occurred in the server" });
    }
});
exports.default = router;
