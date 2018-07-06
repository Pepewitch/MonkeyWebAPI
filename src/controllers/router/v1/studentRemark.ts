import { Router } from "express";
import { body } from "express-validator/check";
import { Observable } from "../../../../node_modules/rxjs";
import { UserPosition } from "../../../models/v1/users";
import { StudentRemark } from "../../../repositories/StudentRemark";
import { authenticateRequestWithPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/set",
    authenticateRequestWithPosition(UserPosition.admin, UserPosition.dev, UserPosition.mel),
    body("studentID").isInt(),
    body("quarterID").isInt().optional(),
    body("remark").isString(),
    validateRequest,
    (req, res) => {
        StudentRemark.getInstance().set(req.body.studentID, req.body.remark, req.body.quarterID).subscribe(completionHandler(res));
    },
);
