import { Router } from "express";
import { body, oneOf, param } from "../../../../node_modules/express-validator/check";
import { StudentInfo } from "../../../repositories/StudentInfo";
import { authorizeRequestWithAdminPosition, completionHandler, validateRequest } from "../util/requestValidator";

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

// router.get(
//     "/default",
//     authenticateRequest,
//     query("summer").isBoolean().optional(),
//     validateRequest,
//     (req, res) => {
//         let observable: Observable<IQuarterModel | null>;
//         if (req.query.summer === "true") {
//             observable = Quarter.getInstance().defaultQuarter(QuarterType.summer);
//         } else {
//             observable = Quarter.getInstance().defaultQuarter();
//         }
//         observable.subscribe(
//             (quarter) => res.status(200).send({ quarter }),
//             errorHandler(res),
//         );
//     },
// );

router.post(
    "/",
    authorizeRequestWithAdminPosition,
    body("studentID").isInt(),
    oneOf([
        body("phone").isMobilePhone("th-TH"),
        body("school").isString(),
    ]),
    validateRequest,
    (req, res) => {
        StudentInfo.getInstance().set(
            req.body.studentID,
            {
                Phone: req.body.phone,
                School: req.body.school,
            },
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:studentID",
    authorizeRequestWithAdminPosition,
    param("studentID").isInt(),
    validateRequest,
    (req, res) => {
        StudentInfo.getInstance().delete(req.params.studentID,
        ).subscribe(completionHandler(res));
    },
);
