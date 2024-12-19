import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import JWT_SECRET from "../config";

declare global {
    namespace Express{
        interface Request{
            userId?: string | JwtPayload
        }
    }
}

interface customDecodedInterface {
    userId?: string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try{
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            res.status(401).json({
                msg: "Access denied"
            })
            return
        }

        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

        if(decoded){
            req.userId = (decoded as customDecodedInterface).userId
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