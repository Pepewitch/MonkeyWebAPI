import { Router } from "express";
import { router as quarter } from "./quarter";
import { router as studentStage } from "./studentStage";
import { router as submission } from "./submission";
import { router as user } from "./user";

export const router = Router();

router.use("/quarter", quarter);
router.use("/studentStage", studentStage);
router.use("/submission", submission);
router.use("/user", user);
