import { Router } from "express";
import { body, oneOf, param } from "express-validator/check";
import { join } from "path";
import { Visibility } from "../../../models/util/context";
import { UserPosition } from "../../../models/v1/users";
import { FileManager } from "../../../repositories/FileManager";
import { Receipt } from "../../../repositories/Receipt";
import { receipt } from "../util/fileHandler";
import { authenticateRequest, authorizeRequestWithAdminPosition, authorizeRequestWithoutPosition, authorizeRequestWithPosition, completionHandler, errorHandler, validateFile, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/:receiptID",
    authenticateRequest,
    param("receiptID").isInt(),
    validateRequest,
    (req, res) => {
        let imagePath: string;
        FileManager
            .getInstance()
            .downloadReceipt(req.params.receiptID)
            .subscribe(
                (path) => {
                    imagePath = join(__dirname, "../../../../", path);
                    res.sendFile(imagePath);
                },
                errorHandler(res),
                () => FileManager.cleanUp(res, imagePath),
        );
    },
);

router.post(
    "/:quarterID/:studentID",
    authorizeRequestWithoutPosition(UserPosition.tutor),
    receipt,
    validateFile,
    param("quarterID").isInt(),
    param("studentID").isInt(),
    validateRequest,
    (req, res) => {
        Receipt
            .getInstance()
            .add(req.params.studentID, req.file, req.body.quarterID)
            .subscribe(completionHandler(res));
    },
);

router.patch(
    "/:receiptID",
    authorizeRequestWithAdminPosition,
    param("receiptID"),
    oneOf([
        body("studentID").isInt(),
        body("quarterID").isInt(),
        body("visibility").isIn(Object.keys(Visibility)),
    ]),
    validateRequest,
    (req, res) => {
        Receipt
            .getInstance()
            .edit(
                req.params.receiptID, {
                    QuarterID: req.body.quarterID,
                    StudentID: req.body.studentID,
                    Visibility: req.body.visibility,
                },
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:receiptID",
    authorizeRequestWithPosition(UserPosition.dev),
    param("receiptID").isInt(),
    validateRequest,
    (req, res) => {
        Receipt
            .getInstance()
            .delete(req.params.receiptID)
            .subscribe(completionHandler(res));
    },
);
