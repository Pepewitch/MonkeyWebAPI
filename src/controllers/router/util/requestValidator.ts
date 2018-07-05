import { compose } from "compose-middleware";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { header, validationResult as validate } from "express-validator/check";
import { Subscriber } from "rxjs";
import { SubjectSubscriber } from "rxjs/internal/Subject";
import { UserPosition } from "../../../models/v1/users";
import { User } from "../../../repositories/Users";
import { JWTAuth } from "../../auth/JWTAuth";

export const authenticateRequest = compose([
    header("authorization").isString(),
    validateRequest,
    validateHeader,
    authenticateUser,
]);

export function authenticateRequestWithPosition(...positions: UserPosition[]): RequestHandler {
    return compose([
        authenticateRequest,
        (req: Request, res: Response, next: NextFunction) => {
            User.getInstance().getPosition(req.user.id).subscribe(
                (position) => {
                    if (positions.indexOf(position) === -1) {
                        res.sendStatus(401);
                    } else {
                        next();
                    }
                },
                (_) => {
                    res.sendStatus(500);
                },
            );
        },
    ]);
}

export function validateRequest(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (!validate(req).isEmpty()) {
        res.status(400).send({ error: validate(req).array() });
    } else {
        next();
    }
}

function validateHeader(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    try {
        const splitHeader = req.headers.authorization.split(" ");
        if (splitHeader[0] !== "Bearer") {
            throw new Error("Authorization schema not match");
        }
        req.authToken = splitHeader[1];
        next();
    } catch (_) {
        res.sendStatus(401);
    }
}

export function validateFile(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (req.file || req.files) {
        next();
    } else {
        res.status(400).send({
            error: "No file or files upload",
        });
    }
}

export function completionHandler(
    res: Response,
): Subscriber<any> {
    return SubjectSubscriber.create(
        // tslint:disable-next-line:no-empty
        () => { },
        (error) => res.status(500).send({ error: error.toString() }),
        () => res.sendStatus(200),
    );
}

function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    try {
        req.user = {
            id: JWTAuth.decodeToken(req.authToken),
        };
        next();
    } catch (_) {
        res.sendStatus(401);
    }
}
