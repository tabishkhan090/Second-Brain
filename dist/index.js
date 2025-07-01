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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// require('dotenv').config();
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config");
const mongoose_1 = __importDefault(require("mongoose"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^])[A-Za-z\d@$!%*?#&^]{8,20}$/;
    const reqbody = zod_1.z.object({
        username: zod_1.z.string().min(3).max(10),
        password: zod_1.z.string().min(8).max(20).regex(passwordRegex)
    });
    const parse = reqbody.safeParse(req.body);
    if (parse.success) {
        const username = req.body.username;
        const password = req.body.password;
        const hashpassword = yield bcrypt_1.default.hash(password, 5);
        try {
            yield db_1.UserModel.create({
                username: username,
                password: hashpassword
            });
            res.status(200).json({
                message: "Signed up"
            });
        }
        catch (e) {
            res.status(403).json({
                message: "User already exists with this username"
            });
        }
    }
    else {
        res.status(411).json({
            message: "Error in inputs"
        });
    }
    res.status(500).json({
        message: "Server error"
    });
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.UserModel.findOne({
        username
    });
    if (user) {
        //@ts-ignore
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            res.status(403).json({
                message: "Wrong email password"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_USER_PASSWORD);
        res.status(200).json({
            token: token
        });
    }
    else {
        res.json({
            message: "User not found"
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, link, title } = req.body;
    yield db_1.ContentModel.create({
        type: type,
        link: link,
        title: title,
        tags: [],
        // @ts-ignore
        userId: req.userId
    });
    res.json({
        message: "Content added"
    });
}));
app.get("/api/v1/content", (req, res) => {
});
app.delete("/api/v1/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGODB_URL);
        app.listen(3000);
        console.log("Server is running at http://localhost:3000");
    });
}
main();
