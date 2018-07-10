import { Router } from "express";
import { submissionDocuments } from "../util/fileHandler";
import { authenticateRequestWithTutorPosition, validateFile } from "../util/requestValidator";

export const router = Router();

router.post(
    "/upload",
    authenticateRequestWithTutorPosition,
    submissionDocuments,
    validateFile,
    (req, res) => {
        console.log(req.files);
        res.sendStatus(200);
    },
);
