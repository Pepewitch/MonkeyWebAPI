import { Router } from "express";
import { body, oneOf, param } from "express-validator/check";
import { UserPosition } from "../../../models/v1/users";
import { SubmissionChat } from "../../../repositories/SubmissionChat";
import { authorizeRequestWithAdminPosition, authorizeRequestWithPosition, authorizeRequestWithTutorPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/:submissionID",
    authorizeRequestWithTutorPosition,
    param("submissionID").isInt(),
    validateRequest,
    (req, res) => {
        SubmissionChat.getInstance().list(req.params.submissionID).subscribe(
            (chats) => res.status(200).send({ chats }),
            errorHandler(res),
        );
    },
);

router.post(
    "/:submissionID",
    authorizeRequestWithTutorPosition,
    param("submissionID").isInt(),
    body("message").isString(),
    body("senderID").isInt().optional(),
    validateRequest,
    (req, res) => {
        SubmissionChat.getInstance().add(
            req.params.submissionID,
            req.body.message,
            req.body.senderID || req.user.id,
        ).subscribe(completionHandler(res));
    },
);

router.post(
    "/hide/:submissionChatID",
    authorizeRequestWithTutorPosition,
    param("submissionChatID").isInt(),
    validateRequest,
    (req, res) => {
        SubmissionChat.getInstance().hide(req.params.submissionChatID).subscribe(completionHandler(res));
    },
);

router.post(
    "/show/:submissionChatID",
    authorizeRequestWithAdminPosition,
    param("submissionChatID").isInt(),
    validateRequest,
    (req, res) => {
        SubmissionChat.getInstance().show(req.params.submissionChatID).subscribe(completionHandler(res));
    },
);

router.patch(
    "/:submissionChatID",
    authorizeRequestWithTutorPosition,
    param("submissionChatID").isInt(),
    oneOf([
        body("senderID").isInt(),
        body("message").isString(),
    ]),
    validateRequest,
    (req, res) => {
        SubmissionChat.getInstance().edit(
            req.params.submissionChatID, {
                ChatMessage: req.body.message,
                SenderID: req.body.senderID,
            },
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:submissionChatID",
    authorizeRequestWithPosition(UserPosition.dev),
    param("submissionChatID").isInt(),
    validateRequest,
    (req, res) => {
        SubmissionChat.getInstance().delete(
            req.params.submissionChatID,
        ).subscribe(completionHandler(res));
    },
);
