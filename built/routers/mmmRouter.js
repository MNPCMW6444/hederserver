"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mmm_1 = __importDefault(require("../models/mmm"));
const nnn_1 = __importDefault(require("../models/nnn"));
const router = express_1.default.Router();
router.post("/addnew", async (req, res) => {
    try {
        const { name, tags, find, place } = req.body;
        const newMemoryResult = new mmm_1.default({
            name,
            tags,
            find,
            place,
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
router.get("/michael", async (req, res) => {
    try {
        const aaaaa = await nnn_1.default.find();
        res.json({ yoad: aaaaa[0].name === "open", dsfds: "gfssdf" });
    }
    catch (err) {
        console.error(err);
        res.json({ yoad: false, dsfds: "gfssdf" });
    }
});
router.post("/open", async (req, res) => {
    setTimeout(() => nnn_1.default.remove({}, function (err) {
        console.log("collection removed");
    }), 120000);
    const what = req.body.what;
    const s = new nnn_1.default({ name: what });
    await s.save();
    res.json({ yoad: what, dsfds: "gfssdf" });
});
exports.default = router;
