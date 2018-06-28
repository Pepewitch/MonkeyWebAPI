import { from, Observable } from "rxjs";
import Sequelize from "sequelize";
import { Connection } from "../models/Connection";
import { IUserModel, UserInstance, userModel } from "../models/v1/users";

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

}
