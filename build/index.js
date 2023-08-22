"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const connect_1 = require("./db/connect");
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.status(200).send("running...");
});
const port = process.env.PORT || 3000;
// Starts application connecting it to Database
const start = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.env.MONGO_URI) {
                yield (0, connect_1.connectToDB)(process.env.MONGO_URI);
            }
            else {
                throw new Error("Invalid URI");
            }
            app.listen(port, () => console.log(`Server is listening to port ${port}`));
        }
        catch (error) {
            console.log(error);
        }
    });
};
start();
