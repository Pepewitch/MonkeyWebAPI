import Sequelize from "sequelize";
import { userModel } from "./users";

export interface IStudentInfoModel {
    ID?: number;
    Phone?: string;
    School?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type StudentInfoInstance = Sequelize.Instance<IStudentInfoModel> & IStudentInfoModel;

// tslint:disable:object-literal-sort-keys
export function studentInfoModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IStudentInfoModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        Phone: {
            type: Sequelize.STRING(10),
            allowNull: true,
        },
        School: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
    };
    return sequalize.define<StudentInfoInstance, IStudentInfoModel>("StudentInfo", attributes, {
        tableName: "StudentInfo",
    });
}
