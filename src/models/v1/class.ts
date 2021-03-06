import Sequelize from "sequelize";
import { quarterModel } from "./quarter";
import { roomModel } from "./room";
import { userModel } from "./users";

export enum ClassType {
    hybrid = "hybrid",
    course = "course",
    skill = "skill",
}

export interface IClassModel {
    ID?: number;
    ClassName: string;
    QuarterID: number;
    ClassDate: Date;
    ClassSubject: string;
    Grade?: string;
    TutorID?: number;
    RoomID?: number;
    ClassDescription?: string;
    Suggestion?: string;
    ClassTimes?: number;
    ClassType: ClassType;
    Price?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ClassInstance = Sequelize.Instance<IClassModel> & IClassModel;

// tslint:disable:object-literal-sort-keys
export function classModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IClassModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        ClassName: {
            type: Sequelize.STRING(50),
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
        ClassDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        ClassSubject: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        Grade: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        TutorID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        RoomID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: roomModel(sequalize),
                key: "ID",
            },
        },
        ClassDescription: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        Suggestion: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        ClassTimes: {
            type: Sequelize.TINYINT,
            allowNull: true,
        },
        ClassType: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        Price: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    };

    return sequalize.define<ClassInstance, IClassModel>("Class", attributes, {
        tableName: "Class",
    });
}
