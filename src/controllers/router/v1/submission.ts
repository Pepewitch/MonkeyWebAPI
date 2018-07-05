import { Router } from "express";
import { body } from "express-validator/check";
import { UserPosition, UserStatus } from "../../../models/v1/users";
import { submissionDocuments } from "../util/fileHandler";
import { authenticateRequestWithPosition, validateFile, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/upload",
    authenticateRequestWithPosition(UserPosition.tutor, UserPosition.admin, UserPosition.dev, UserPosition.mel),
    submissionDocuments,
    validateFile,
    body("classID").isInt(),
    body("submissionTimes").isInt(),
    validateRequest,
    (req, res) => {
        console.log(req.files);
        res.sendStatus(200);
    },
);
