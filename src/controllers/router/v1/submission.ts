import { Router } from "express";
import { body, param } from "express-validator/check";
import { Submission } from "../../../repositories/Submission";
import { submissionDocuments } from "../util/fileHandler";
import { authorizeRequestWithAdminPosition, authorizeRequestWithTutorPosition, completionHandler, validateFile, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/:classID/:time",
    authorizeRequestWithTutorPosition,
    submissionDocuments,
    validateFile,
    param("classID").isInt(),
    param("time").isInt(),
    (req, res) => {
        Submission.getInstance().add(
            req.params.classID,
            req.params.time,
            req.files,
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:submissionID",
    authorizeRequestWithAdminPosition,
    param("submissionID").isInt(),
    validateRequest,
    (req, res) => {
        Submission.getInstance().delete(
            req.params.submissionID,
        ).subscribe(completionHandler(res));
    },
);

router.patch(
    "/:submissionID",
    authorizeRequestWithTutorPosition,
    param("submissionID").isInt(),
    body("time").isInt(),
    (req, res) => {
        Submission.getInstance().edit(
            req.params.submissionID, {
                SubmissionTimes: req.body.time,
            },
        ).subscribe(completionHandler(res));
    },
);
