import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import Sequelize from "sequelize";
import { Connection } from "../models/Connection";
import { IUserModel, UserInstance, userModel, UserPosition, UserStatus } from "../models/v1/users";
import { Crypto } from "./util/crypto";

export class User {

    public static getInstance(): User {
        if (!this.instance) {
            this.instance = new User();
        }
        return this.instance;
    }

    private static instance: User;

    private userModel: Sequelize.Model<UserInstance, IUserModel>;

    private constructor() {
        this.userModel = userModel(Connection.getInstance().getConnection());
    }

    public generateStudent(): Observable<string> {
        return from(Connection.getInstance().query<number>(
            `SELECT TOP(1) ID FROM Users WHERE Position = 'student' ORDER BY ID DESC;`,
        )).pipe(
            flatMap((lastStudentID) => this.createStudent(lastStudentID[0])),
        );
    }

    public createStudent(ID: number): Observable<string> {
        const password = this.generatePassword();
        return from(this.userModel.create({
            ID,
            Position: UserPosition.student,
            UserPassword: Crypto.encrypt(password),
            UserStatus: UserStatus.inactive,
        })).pipe(
            map(() => password),
        );
    }

    public getUserInfo(ID: number): Observable<IUserModel> {
        return from(this.userModel.findOne<IUserModel>({ where: { ID } }));
    }

    public login(ID: number, password: string): Observable<boolean> {
        return from(this.userModel.findOne<string>({
            attributes: ["UserPassword"],
            where: { ID },
        })).pipe(
            map((user) => Crypto.equals(user.UserPassword, password)),
        );
    }

    public getPosition(ID: number): Observable<UserPosition> {
        return from(this.userModel.findOne<UserPosition>({
            attributes: ["Position"],
            where: { ID },
        })).pipe(
            map((user) => user.Position),
        );
    }

    public edit(ID: number, value: Partial<IUserModel>): Observable<number> {
        let updateValue = {} as Partial<IUserModel>;
        if (value.Firstname) {
            updateValue = { ...updateValue, Firstname: value.Firstname };
        }
        if (value.Lastname) {
            updateValue = { ...updateValue, Lastname: value.Lastname };
        }
        if (value.Nickname) {
            updateValue = { ...updateValue, Nickname: value.Nickname };
        }
        if (value.FirstnameEn) {
            updateValue = { ...updateValue, FirstnameEn: value.FirstnameEn };
        }
        if (value.LastnameEn) {
            updateValue = { ...updateValue, LastnameEn: value.LastnameEn };
        }
        if (value.NicknameEn) {
            updateValue = { ...updateValue, NicknameEn: value.NicknameEn };
        }
        if (value.Email) {
            updateValue = { ...updateValue, Email: value.Email };
        }
        if (value.Phone) {
            updateValue = { ...updateValue, Phone: value.Phone };
        }
        if (value.UserPassword) {
            updateValue = {
                ...updateValue,
                UserPassword: Crypto.encrypt(value.UserPassword),
            };
        }
        if (value.UserStatus) {
            updateValue = { ...updateValue, UserStatus: value.UserStatus };
        }
        if (value.Position) {
            updateValue = { ...updateValue, Position: value.Position };
        }
        return from(this.userModel.update(updateValue, { where: { ID } })).pipe(
            map((result) => result[0]),
        );
    }

    private generatePassword(): string {
        const randomPassword = "" + Math.random();
        return randomPassword.substr(2, 4);
    }
}
