import { Router } from "express";
import { submissionDocuments } from "../util/fileHandler";
import { validateFile } from "../util/requestValidator";

export const router = Router();

router.post(
    "/upload",
    submissionDocuments,
    validateFile,
    (req, res) => {
        console.log(req.files);
        res.sendStatus(200);
    },
);
