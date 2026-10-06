import { Router } from "express";
import { checkCharacter, getGameDisplay } from "../controllers/gameController.js";

const gameRouter: Router = Router();

gameRouter.get("/:boardNumber", getGameDisplay);
gameRouter.post("/:boardNumber/check", checkCharacter);

export default gameRouter;
