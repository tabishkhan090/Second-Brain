"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_USER_PASSWORD = void 0;
if (!process.env.JWT_USER_PASSWORD) {
    throw new Error("JWT_USER_PASSWORD is not defined in the environment variables");
}
exports.JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
