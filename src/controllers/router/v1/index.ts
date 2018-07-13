import { Router } from "express";
import { router as attendance } from "./attendance";
import { router as classRouter } from "./class";
import { router as classReg } from "./classReg";
import { router as quarter } from "./quarter";
import { router as studentRemark } from "./studentRemark";
import { router as studentStage } from "./studentStage";
import { router as submission } from "./submission";
import { router as submissionChat } from "./submissionChat";
import { router as user } from "./user";

export const router = Router();

router.use("/attendance", attendance);
router.use("/class", classRouter);
router.use("/classReg", classReg);
router.use("/quarter", quarter);
router.use("/studentRemark", studentRemark);
router.use("/studentStage", studentStage);
router.use("/submission", submission);
router.use("/submissionChat", submissionChat);
router.use("/user", user);
