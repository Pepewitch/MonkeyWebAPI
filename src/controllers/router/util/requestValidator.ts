import { compose, Next } from "compose-middleware";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { header, validationResult as validate } from "express-validator/check";
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
