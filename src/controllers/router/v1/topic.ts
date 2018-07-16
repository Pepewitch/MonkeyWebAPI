import { Router } from "express";
import { body, param } from "express-validator/check";
import { Topic } from "../../../repositories/Topic";
import { authorizeRequestWithAdminPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/",
    authorizeRequestWithAdminPosition,
    body("subject").isString().isLength({ min: 1, max: 1 }),
    body("class").isString().isLength({ min: 1, max: 1 }),
    body("topic").isString().isLength({ min: 1, max: 4 }),
    body("topicName").isString(),
    validateRequest,
    (req, res) => {
        Topic
            .getInstance()
            .add(
                req.body.subject,
                req.body.class,
                req.body.topic,
                req.body.topicName,
        ).subscribe(completionHandler(res));
    },
);

router.patch(
    "/:topicID",
    authorizeRequestWithAdminPosition,
    param("topicID").isInt(),
    body("topicName").isString(),
    validateRequest,
    (req, res) => {
        Topic
            .getInstance()
            .edit(
                req.params.topicID, {
                    TopicName: req.body.topicName,
                },
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:topicID",
    authorizeRequestWithAdminPosition,
    param("topicID").isInt(),
    validateRequest,
    (req, res) => {
        Topic
            .getInstance()
            .delete(req.params.topicID)
            .subscribe(completionHandler(res));
    },
);
