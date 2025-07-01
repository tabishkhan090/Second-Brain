"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    try {
        const decoded = jsonwebtoken_1.default.verify(header, config_1.JWT_USER_PASSWORD);
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "invalid User"
            });
            return;
        }
        // @ts-ignore
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        res.status(403).json({
            message: "Authorization token missing or malformed"
        });
    }
};
exports.userMiddleware = userMiddleware;
