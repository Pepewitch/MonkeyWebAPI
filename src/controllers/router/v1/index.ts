import { Router } from "express";
import { router as quarter } from "./quarter";
import { router as studentStage } from "./studentStage";
import { router as user } from "./user";

export const router = Router();

router.use("/quarter", quarter);
router.use("/studentStage", studentStage);
router.use("/user", user);
