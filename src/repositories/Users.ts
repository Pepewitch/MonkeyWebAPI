import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { IUserModel, UserInstance, userModel, UserPosition, UserStatus } from "../models/v1/users";
import { SequelizeModel } from "./SequelizeModel";
import { Crypto } from "./util/crypto";
import { partialOf } from "./util/ObjectMapper";

export class User extends SequelizeModel<UserInstance, IUserModel> {

    public static getInstance(): User {
        if (!this.instance) {
            this.instance = new User();
        }
        return this.instance;
    }

    private static instance: User;

    private constructor() {
        super();
        this.model = userModel(Connection.getInstance().getConnection());
    }

    public generateStudent(): Observable<string> {
        return from(Connection.getInstance().select<number>(
            `SELECT TOP(1) ID FROM Users WHERE Position = 'student' ORDER BY ID DESC;`,
        )).pipe(
            flatMap((lastStudentID) => this.createStudent(lastStudentID[0])),
        );
    }

    public createStudent(ID: number): Observable<string> {
        const password = this.generatePassword();
        return from(this.model.create({
            ID,
            Position: UserPosition.student,
            UserPassword: Crypto.encrypt(password),
            UserStatus: UserStatus.inactive,
        })).pipe(
            map(() => password),
        );
    }

    public getUserInfo(ID: number): Observable<IUserModel> {
        return from(this.model.findOne<IUserModel>({
            attributes: {
                exclude: ["UserPassword"],
            },
            where: { ID },
        }));
    }

    public login(ID: number, password: string): Observable<boolean> {
        return from(this.model.findOne<string>({
            attributes: ["UserPassword"],
            where: { ID },
        })).pipe(
            map((user) => Crypto.equals(user.UserPassword, password)),
        );
    }

    public getPosition(ID: number): Observable<UserPosition> {
        return from(this.model.findOne<UserPosition>({
            attributes: ["Position"],
            where: { ID },
        })).pipe(
            map((user) => user.Position),
        );
    }

    public edit(ID: number, value: Partial<IUserModel>): Observable<number> {
        let updateValue = partialOf<IUserModel>(value);
        if (value.UserPassword) {
            updateValue = {
                ...updateValue,
                UserPassword: Crypto.encrypt(value.UserPassword),
            };
        }
        console.log(updateValue);
        return from(this.model.update(updateValue, { where: { ID } })).pipe(
            map((result) => result[0]),
        );
    }

    private generatePassword(): string {
        const randomPassword = "" + Math.random();
        return randomPassword.substr(2, 4);
    }
}
