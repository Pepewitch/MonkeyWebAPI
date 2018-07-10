import { Router } from "express";
import { submissionDocuments } from "../util/fileHandler";
import { authorizeRequestWithTutorPosition, validateFile } from "../util/requestValidator";

export const router = Router();

router.post(
    "/upload",
    authorizeRequestWithTutorPosition,
    submissionDocuments,
    validateFile,
    (req, res) => {
        console.log(req.files);
        res.sendStatus(200);
    },
);

// router.post(
//     "/add",
//     authenticateRequestWithTutorPosition,

// )
