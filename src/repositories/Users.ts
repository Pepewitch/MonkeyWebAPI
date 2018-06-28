import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import Sequelize from "sequelize";
import { Connection } from "../models/Connection";
import { IUserModel, UserInstance, userModel } from "../models/v1/users";
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

}
