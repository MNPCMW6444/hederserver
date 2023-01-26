"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mmm_1 = __importDefault(require("../models/mmm"));
const router = express_1.default.Router();
router.post("/addnew", async (req, res) => {
    try {
        const { name, tags, find } = req.body;
        const newMemoryResult = new mmm_1.default({
            name,
            tags,
            find,
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
router.get("/getall", async (req, res) => {
    try {
        const savedMemoryResult = await mmm_1.default.find();
        res.json(savedMemoryResult);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ serverError: "Unexpected error occurred in the server" });
    }
});
exports.default = router;
