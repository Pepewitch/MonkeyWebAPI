import Sequelize from "sequelize";
import { quarterModel } from "./quarter";
import { userModel } from "./users";

export interface IStudentLevelModel {
    ID: number;
    StudentID: number;
    QuarterID: number;
    Subject: string;
    Level: string;
    createAt: Date;
    updatedAt: Date;
}

export type StudentLevelInstance = Sequelize.Instance<IStudentLevelModel> & IStudentLevelModel;

// tslint:disable:object-literal-sort-keys
export function roomModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IStudentLevelModel> = {
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
        Subject: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        Level: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        createAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    };

    return sequalize.define<StudentLevelInstance, IStudentLevelModel>("StudentLevel", attributes, {
        tableName: "StudentLevel",
    });
}
