import { sign, verify } from "jsonwebtoken";
import moment from "moment";
import { JWT_SECRET } from "../../util/secrets";

interface IPayload {
    userID: number;
    exp: Date;
}

export class JWTAuth {

    public static getToken(userID: number): { token: string, refreshToken: string, exp: Date } {
        return {
            exp: moment().add(7, "days").toDate(),
            refreshToken: this.encode({ userID }, "1m"),
            token: this.encode({ userID }),
        };
    }

    public static decodeToken(token: string): number | null {
        try {
            const result = verify(token, JWT_SECRET) as IPayload;
            return result.userID;
        } catch (_) {
            return null;
        }
    }

    private static encode(payload: string | object, expiresIn = "1w"): string {
        return sign(payload, JWT_SECRET, { expiresIn });
    }

}
