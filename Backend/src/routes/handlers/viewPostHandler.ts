import { Router, Request, Response } from "express";


const viewPostHandler: Router = Router();

// use zod 

// get all posts
viewPostHandler.get("/", async (req: Request, res: Response): Promise<void> => {
    try{

    }   
    catch (e) {
        console.error("Error while getting all posts")
        res.status(401).json({
            msg: "Error while getting all posts"
        })
        return
    }   
})

// get my posts
viewPostHandler.get("/myPosts", async (req: Request, res: Response): Promise<void> => {
    try{

    }
    catch (e) {
        console.error("Error while getting all posts")
        res.status(401).json({
            msg: "Error while getting all posts"
        })
        return
    }
})

// get other user's post
viewPostHandler.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try{

    }
    catch (e) {
        console.error("Error while getting all posts")
        res.status(401).json({
            msg: "Error while getting all posts"
        })
        return
    }
})

export default viewPostHandler;