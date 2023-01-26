"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const test = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    attentionScore: {
        type: Number,
        required: true,
    },
    memoryScore: {
        type: Number,
        required: true,
    },
    flexabilityScore: {
        type: Number,
        required: true,
    },
    creativityScore: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("test", test);
