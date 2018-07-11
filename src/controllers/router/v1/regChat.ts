import { Router } from "express";
import { body, param, oneOf } from "express-validator/check";
import { Visibility } from "../../../models/util/context";
import { RegChat } from "../../../repositories/RegChat";
import { authenticateRequestWithAdminPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/",
    authenticateRequestWithAdminPosition,
    body("studentID").isInt(),
    body("chatMessage").isString(),
    body("quarterID").isInt().optional(),
    body("senderID").isInt().optional(),
    validateRequest,
    (req, res) => {
        RegChat.getInstance().add(
            req.body.studentID,
            req.body.chatMessage,
            req.body.senderID || req.user.id,
            req.body.quarterID,
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:regChatID",
    authenticateRequestWithAdminPosition,
    param("regChatID").isInt(),
    validateRequest,
    (req, res) => {
        RegChat.getInstance().delete(req.params.quarterID).subscribe(completionHandler(res));
    },
);

router.patch(
    "/:regChatID",
    authenticateRequestWithAdminPosition,
    param("regChatID").isInt(),
    oneOf([
        body("chatMessage").isString(),
        body("visibility").isIn(Object.keys(Visibility)),
    ]),
    validateRequest,
    (req, res) => {
        RegChat.getInstance().edit(
            req.params.regChatID,
            {
                ChatMessage: req.body.chatMessage,
                Visibility: req.body.visibility,
            },
        ).subscribe(completionHandler(res));
    },
);
