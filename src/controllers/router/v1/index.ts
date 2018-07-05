import { Router } from "express";
import { router as quarter } from "./quarter";
import { router as user } from "./user";

export const router = Router();

router.use("/user", user);
router.use("/quarter", quarter);
