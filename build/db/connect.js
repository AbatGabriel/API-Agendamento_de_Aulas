"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Connects to database with url given by env variable
const connectToDB = function (url) {
    return mongoose_1.default.connect(url);
};
exports.connectToDB = connectToDB;
