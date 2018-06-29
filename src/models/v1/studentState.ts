import Sequelize from "sequelize";
import { quarterModel } from "./quarter";
import { userModel } from "./users";

export enum StudentStage {
    unregistered = "unregistered",
    untransferred = "untransferred",
    transferred = "transferred",
    rejected = "rejected",
    pending = "pending",
    approved = "approved",
    finished = "finished",
    dropped = "dropped",
}

export interface IStudentStateModel {
    ID: number;
    Grade: number;
    QuarterID: number;
    StudentID: number;
    Stage: StudentStage;
    createdAt?: Date;
    updatedAt?: Date;
}

export type StudentStateInstance = Sequelize.Instance<IStudentStateModel> & IStudentStateModel;

// tslint:disable:object-literal-sort-keys
export function studentStateModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IStudentStateModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        Grade: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        QuarterID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: quarterModel(sequalize),
                key: "ID",
            },
        },
        StudentID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        Stage: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
    };

    return sequalize.define<StudentStateInstance, IStudentStateModel>("StudentState", attributes, {
        tableName: "StudentState",
    });
}
