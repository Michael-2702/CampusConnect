import express, { Express, Router, Request, Response } from "express";


const reportPostHandler: Router = express();

// report a post
reportPostHandler.get("/signup", (req: Request, res: Response) => {

})

// un-report a post

// view reported posts

export default reportPostHandler;