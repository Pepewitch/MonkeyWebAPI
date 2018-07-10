import { compose } from "compose-middleware";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { header, validationResult as validate } from "express-validator/check";
import _ from "lodash";
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

export const authenticateRequestWithAdminPosition = authenticateRequestWithPosition(UserPosition.admin, UserPosition.dev, UserPosition.mel);

export const authenticateRequestWithTutorPosition =
    authenticateRequestWithPosition(UserPosition.tutor, UserPosition.admin, UserPosition.dev, UserPosition.mel);

export function authenticateRequestWithoutPosition(...positions: UserPosition[]): RequestHandler {
    const validPosition = _.pullAll(Object.keys(UserPosition), positions);
    return authenticatePosition(validPosition as UserPosition[]);
}

export function authenticateRequestWithPosition(...positions: UserPosition[]): RequestHandler {
    return authenticatePosition(positions);
}

function authenticatePosition(positions: UserPosition[]): RequestHandler {
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
                // tslint:disable-next-line:no-shadowed-variable
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

export function errorHandler(
    res: Response,
): (error: any) => void {
    return (error) => res.status(500).send({ error: error.toString() });
}

function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const id = JWTAuth.decodeToken(req.authToken);
    if (id !== null) {
        req.user = { id };
        next();
    } else {
        res.sendStatus(401);
    }
}
