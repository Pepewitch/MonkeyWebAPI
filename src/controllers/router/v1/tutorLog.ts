import { Router } from "express";
import { TutorLog } from "../../../repositories/TutorLog";
import { authorizeRequestWithTutorPosition, completionHandler } from "../util/requestValidator";

export const router = Router();

router.post(
    "/checkIn",
    authorizeRequestWithTutorPosition,
    // TODO: check location of request
    (req, res) => {
        TutorLog
            .getInstance()
            .add(req.user.id, new Date())
            .subscribe(completionHandler(res));
    },
);
