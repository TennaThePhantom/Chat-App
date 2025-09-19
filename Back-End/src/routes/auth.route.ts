import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.post("/signup", (req: Request, res: Response) => {
	res.send("Signup route");
});

router.post("/login", (req: Request, res: Response) => {
	res.send("login route");
});

router.post("/signup", (req: Request, res: Response) => {
	res.send("logout route");
});
export default router;
