"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.status(200).send("running...");
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening to port ${port}`));
