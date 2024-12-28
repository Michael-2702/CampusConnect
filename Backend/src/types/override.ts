import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/db";

declare global {
    namespace Express{
        interface Request{
            userId?: string | JwtPayload,
            user: IUser
        }
    }
}

