import dotenv from "dotenv";
dotenv.config();
// require('dotenv').config();
import express from "express";
import {UserModel, ContentModel, LinkModel} from "./db";
import jwt from "jsonwebtoken";
import { z } from "zod"
import bcrypt from "bcrypt";
import { JWT_USER_PASSWORD } from "./config";
import mongoose from "mongoose";
import { userMiddleware } from "./middleware";
import { Random } from "./utlis";

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

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const content = await ContentModel.find({
        // @ts-ignore
        userId: req.userId
    }).populate( "userId", "username")
    res.status(200).json({
        content
    })
})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        _id: contentId,
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        message: "Deleted"
    })
})

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    if(share){
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        })
        if(existingLink){
            res.json({
                hash: existingLink.hash
            })
        }
        const link = Random(10);
        await LinkModel.create({
        hash: link,
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        link
    })
    }else{
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const link = req.params.shareLink;
    const user = await LinkModel.findOne({
        hash: link
    })
    if (!user) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    const content = await ContentModel.find({
        //@ts-ignore
        userId: user.userId
    })
    const person = await UserModel.findOne({
        //@ts-ignore
        _id: user.userId
    })
    if (!person) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: person.username,
        content: content
    })
})

async function main() {
    await mongoose.connect(process.env.MONGODB_URL as string);
    app.listen(3000);
    console.log("Server is running at http://localhost:3000");
}
main();