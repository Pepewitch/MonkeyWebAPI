import Sequelize from "sequelize";
import { classModel } from "./class";
import { hbSheetModel } from "./hbSheet";
import { userModel } from "./users";

export interface IClassLogModel {
    ID: number;
    StudentID: number;
    ClassID: number;
    StudyDate: Date;
    CheckIn?: Date;
    CheckOut?: Date;
    HBSheetID: number;
    TutorID: number;
    Progress?: string;
    createAt?: Date;
    updatedAt?: Date;
}

export type ClassLogInstance = Sequelize.Instance<IClassLogModel> & IClassLogModel;

// tslint:disable:object-literal-sort-keys
export function classLogModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IClassLogModel> = {
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
        StudyDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        CheckIn: {
            type: Sequelize.TIME,
            allowNull: true,
        },
        CheckOut: {
            type: Sequelize.TIME,
            allowNull: true,
        },
        HBSheetID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: hbSheetModel(sequalize),
                key: "ID",
            },
        },
        TutorID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        Progress: {
            type: Sequelize.STRING(20),
            allowNull: true,
        },
    };

    return sequalize.define<ClassLogInstance, IClassLogModel>("ClassLog", attributes, {
        tableName: "ClassLog",
    });
}
