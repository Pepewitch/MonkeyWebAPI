import Sequelize from "sequelize";
import { classModel } from "./class";
import { userModel } from "./users";

export enum RegStatus {
    selected = "selected",
    rejected = "rejected",
    registered = "registered",
    removed = "removed",
}

export interface IClassRegModel {
    ID: number;
    StudentID: number;
    ClassID: number;
    RegStatus: RegStatus;
    createAt?: Date;
    updatedAt?: Date;
}

export type ClassRegInstance = Sequelize.Instance<IClassRegModel> & IClassRegModel;

// tslint:disable:object-literal-sort-keys
export function classRegModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IClassRegModel> = {
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
        ClassID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: classModel(sequalize),
                key: "ID",
            },
        },
        RegStatus: {
            type: Sequelize.STRING(10),
            allowNull: true,
            defaultValue: RegStatus.registered,
        },
    };

    return sequalize.define<ClassRegInstance, IClassRegModel>("ClassReg", attributes, {
        tableName: "ClassReg",
    });
}
