import { compose } from "compose-middleware";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { header, validationResult as validate } from "express-validator/check";

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

function validateHeader(): RequestHandler {
    return compose([
        header("authorization").isString(),
        validateRequest,
        authenticateRequest,
    ]);
}

function authenticateRequest(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    try {
        const splitHeader = req.headers.authorization.split(" ")[0];
        if (splitHeader[0] !== "Bearer") {
            throw new Error("Authorization schema not match");
        }
        req.authToken = splitHeader[1];
        next();
    } catch (error) {
        res.sendStatus(401);
    }
}

function getUserAuthorization(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    console.log("object");
}
