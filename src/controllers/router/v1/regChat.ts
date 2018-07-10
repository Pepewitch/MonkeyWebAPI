import { Router } from "express";
import { body, param, oneOf } from "../../../../node_modules/express-validator/check";
import { Visibility } from "../../../models/util/context";
import { RegChat } from "../../../repositories/RegChat";
import { authenticateRequestWithAdminPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

// router.get(
//     "/",
//     authenticateRequest,
//     query("type").isIn(Object.keys(QuarterType)).optional(),
//     (req, res) => {
//         Quarter.getInstance().list(req.query.type).subscribe(
//             (quarters) => res.status(200).send({ quarters }),
//             errorHandler(res),
//         );
//     },
// );

router.post(
    "/",
    authenticateRequestWithAdminPosition,
    body("regChatID").isInt(),
    body("studentID").isInt(),
    body("chatMessage").isString(),
    body("quarterID").isInt(),
    body("visibility").isIn(Object.keys(Visibility)),
    validateRequest,
    (req, res) => {
        RegChat.getInstance().add(
            req.body.regChatID,
            req.body.studentID,
            req.body.chatMessage,
            req.body.quarterID,
            req.user.id,
            req.body.visibility,
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
    body("chatMessage").isString(),
    validateRequest,
    (req, res) => {
        RegChat.getInstance().edit(
            req.params.regChatID,
            {
                ChatMessage: req.body.chatMessage,
            },
        ).subscribe(completionHandler(res));
    },
);
