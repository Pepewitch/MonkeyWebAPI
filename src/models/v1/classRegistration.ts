import Sequelize from "sequelize";
import { classModel } from "./class";
import { userModel } from "./users";

export interface IClassRegModel {
    ID: number;
    StudentID: number;
    ClassID: number;
    Removed?: string;
    createAt: Date;
    updatedAt: Date;
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
        Removed: {
            type: Sequelize.STRING(10),
            allowNull: true,
        },
        createAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    };

    return sequalize.define<ClassRegInstance, IClassRegModel>("ClassReg", attributes, {
        tableName: "ClassReg",
    });
}
