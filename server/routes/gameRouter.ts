import { Router } from "express";
import { getGameDisplay } from "../controllers/gameController.js";

const gameRouter: Router = Router();

gameRouter.get("/:boardNumber", getGameDisplay);

export default gameRouter;
