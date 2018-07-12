import Sequelize from "sequelize";
import { classModel } from "./class";
import { userModel } from "./users";

export enum AttendanceType {
    present = "present",
    absent = "absent",
}

export interface IAttendanceModel {
    ID: number;
    StudentID: number;
    ClassID: number;
    AttendanceDate: Date;
    AttendanceType: AttendanceType;
    Reason?: string;
    Remark?: string;
    Sender?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type AttendanceInstance = Sequelize.Instance<IAttendanceModel> & IAttendanceModel;

// tslint:disable:object-literal-sort-keys
export function attendanceModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IAttendanceModel> = {
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
        AttendanceDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        AttendanceType: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        Reason: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        Remark: {
            type: Sequelize.STRING(10),
            allowNull: true,
        },
        Sender: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
    };

    return sequalize.define<AttendanceInstance, IAttendanceModel>("Attendance", attributes, {
        tableName: "Attendance",
    });
}
