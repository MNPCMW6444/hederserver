"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const memoryResutModal = new mongoose_1.default.Schema({
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    result: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("memoryResut", memoryResutModal);
