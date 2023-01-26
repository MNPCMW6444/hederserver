"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const testTutorial = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, unique: true },
    isTestTutorialDone: { type: Boolean, required: true }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("testTutorial", testTutorial);
