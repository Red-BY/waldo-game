import { Router } from "express";
import { getBoards } from "../controllers/boardsController.js";

const boardsRouter: Router = Router();

boardsRouter.get("/", getBoards);

export default boardsRouter;
