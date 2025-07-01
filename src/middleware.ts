import { NextFunction, Request, Response } from "express"
import { JWT_USER_PASSWORD } from "./config";
import jwt,{ JwtPayload } from "jsonwebtoken";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]; 
    try{
        const decoded = jwt.verify(header as string , JWT_USER_PASSWORD);
            if(typeof decoded === "string"){
                res.status(403).json({
                    message:"invalid User"
                })
                return;
            }
            // @ts-ignore
            req.userId = (decoded as JwtPayload).id;
            next();
    }catch(e){
        res.status(403).json({
                message: "Authorization token missing or malformed"
            })
    }
}