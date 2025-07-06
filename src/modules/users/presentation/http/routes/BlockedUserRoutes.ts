import express, { Request, Response } from "express";
import { BlockedUserControllers } from "../controllers/BlockedUserControllers";

const blockedUserRoutes = express.Router();

blockedUserRoutes.post("/blockUser", (req: Request, res: Response) =>
  BlockedUserControllers.blockUser(req, res),
);

blockedUserRoutes.post("/unblockUser", (req: Request, res: Response) =>
  BlockedUserControllers.unblockUser(req, res),
);

export { blockedUserRoutes };
