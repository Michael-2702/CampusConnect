import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import JWT_SECRET from "../config";
import { IUser, userModel } from "../models/db";

// declare global {
//     namespace Express{
//         interface Request{
//             userId?: string | JwtPayload,
//             user: IUser
//         }
//     }
// }

interface customDecodedInterface {
    userId?: string,
    user: IUser
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            res.status(401).json({
                msg: "Access denied"
            })
            return
        }

        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

        if(decoded){
            const user = await userModel.findById((decoded as customDecodedInterface).userId).select("-password")
            if(!user){
                res.status(400).json({
                    msg: "user not found"
                })
                return
            }
            // req.userId = (decoded as customDecodedInterface).userId
            req.user = user
            next()
        }
        else{
            res.status(401).json({
                msg: "You are not logged in"
            })
            return
        }

    }   
    catch (e) {
        console.error("Error while verifying token");
        res.status(401).json({
            msg: "You are not logged in"
        })
        return
    }
}