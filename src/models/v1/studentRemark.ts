import Sequelize from "sequelize";
import { quarterModel } from "./quarter";
import { userModel } from "./users";

export interface IStudentRemarkModel {
    ID: number;
    StudentID: number;
    QuarterID: number;
    Remark: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type StudentRemarkInstance = Sequelize.Instance<IStudentRemarkModel> & IStudentRemarkModel;

// tslint:disable:object-literal-sort-keys
export function studentRemarkModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IStudentRemarkModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        StudentID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        QuarterID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: quarterModel(sequalize),
                key: "ID",
            },
        },
        Remark: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
    };

    return sequalize.define<StudentRemarkInstance, IStudentRemarkModel>("StudentRemark", attributes, {
        tableName: "StudentRemark",
    });
}
