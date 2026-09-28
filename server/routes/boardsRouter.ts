import { Router } from "express";
import { getBoardNames } from "../controllers/boardsController.js";

const boardsRouter: Router = Router();

boardsRouter.get("/", getBoardNames);

export default boardsRouter;
