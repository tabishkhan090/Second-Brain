import dotenv from "dotenv";
dotenv.config();
// require('dotenv').config();
import express from "express";
import {UserModel, ContentModel} from "./db";
import jwt from "jsonwebtoken";
import { z } from "zod"
import bcrypt from "bcrypt";
import { JWT_USER_PASSWORD } from "./config";
import mongoose from "mongoose";
import { userMiddleware } from "./middleware";
const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^])[A-Za-z\d@$!%*?#&^]{8,20}$/;
    const reqbody = z.object({
        username: z.string().min(3).max(10),
        password: z.string().min(8).max(20).regex(passwordRegex)
    })
    const parse = reqbody.safeParse(req.body); 
    if(parse.success){
        const username = req.body.username;
        const password = req.body.password;
        const hashpassword = await bcrypt.hash(password,5);
        try{
            await UserModel.create({
            username: username,
            password: hashpassword
        })
            res.status(200).json({
                message: "Signed up"
        })
        }catch(e){
            res.status(403).json({
                message: "User already exists with this username"
        })
        }
    }else{
        res.status(411).json({
                message: "Error in inputs"
        })
    }
    res.status(500).json({
                message: "Server error"
        })
})

app.post("/api/v1/signin", async (req,res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({
        username
    })
    if(user){
        //@ts-ignore
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            res.status(403).json({
            message: "Wrong email password"
        })
    }
    const token = jwt.sign({id: user._id},JWT_USER_PASSWORD);
    res.status(200).json({
        token: token
    })
    }else{
        res.json({
            message: "User not found"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const { type, link, title } = req.body;
    await ContentModel.create({
        type: type,
        link: link,
        title: title,
        tags: [],
        // @ts-ignore
        userId: req.userId
    })
    res.json({
        message: "Content added"
    })
})

app.get("/api/v1/content", (req,res) => {
    
})

app.delete("/api/v1/content", async (req,res) => {
    
})

async function main() {
    await mongoose.connect(process.env.MONGODB_URL as string);
    app.listen(3000);
    console.log("Server is running at http://localhost:3000");
}
main();