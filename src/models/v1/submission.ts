import Sequelize from "sequelize";
import { classModel } from "./class";

export enum SubmissionState {
    accepted = "accepted",
    rejected = "rejected",
    pending = "pending",
    empty = "empty",
}

export interface ISubmissionModel {
    ID?: number;
    ClassID: number;
    SubmissionState: string;
    SubmissionTimes: number;
    SubmissionName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type SubmissionInstance = Sequelize.Instance<ISubmissionModel> & ISubmissionModel;

// tslint:disable:object-literal-sort-keys
export function submissionModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ISubmissionModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        ClassID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: classModel(sequalize),
                key: "ID",
            },
        },
        SubmissionState: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        SubmissionTimes: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        SubmissionName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    };

    return sequalize.define<SubmissionInstance, ISubmissionModel>("Submission", attributes, {
        tableName: "Submission",
    });
}
