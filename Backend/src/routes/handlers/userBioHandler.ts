import express, { Express, Router, Request, Response } from "express";


const userBioHanler: Router = express();

// set bio
userBioHanler.post("/", (req: Request, res: Response) => {

})

// update bio 
userBioHanler.put("/", (req: Request, res: Response) => {

})

// delete bio
userBioHanler.delete("/", (req: Request, res: Response) => {

})

export default userBioHanler;