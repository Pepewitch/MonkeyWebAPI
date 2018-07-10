import { Router } from "../../../../node_modules/@types/express";
import { body, oneOf, param } from "../../../../node_modules/express-validator/check";
import { RegStatus } from "../../../models/v1/classReg";
import { ClassReg } from "../../../repositories/ClassReg";
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
    authenticateRequestWithAdminPosition,
    body("classRegID").isInt(),
    body("studentID").isInt(),
    body("classID").isInt(),
    body("regStatus").isIn(Object.keys(RegStatus)),
    validateRequest,
    (req, res) => {
        ClassReg.getInstance().add(
            req.body.classRegID,
            req.body.studentID,
            req.body.classID,
            req.body.regStatus,
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:classRegID",
    authenticateRequestWithAdminPosition,
    param("classRegID").isInt(),
    validateRequest,
    (req, res) => {
        ClassReg.getInstance().delete(req.params.classRegID,
        ).subscribe(completionHandler(res));
    },
);

router.patch(
    "/:classRegID",
    authenticateRequestWithAdminPosition,
    param("classRegID").isInt(),
    body("RegStatus").isIn(Object.keys(RegStatus)),
    validateRequest,
    (req, res) => {
        ClassReg.getInstance().edit(
            req.params.classRegID,
            {
                RegStatus: req.body.RegStatus,
            },
        ).subscribe(completionHandler(res));
    },
);
