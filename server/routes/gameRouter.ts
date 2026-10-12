import { Router } from "express";
import { checkCharacter, completeGame, getGameDisplay } from "../controllers/gameController.js";

const gameRouter: Router = Router();

gameRouter.get("/:boardNumber", getGameDisplay);
gameRouter.post("/:boardNumber/check", checkCharacter);
gameRouter.post("/:boardNumber/complete", completeGame);

export default gameRouter;
