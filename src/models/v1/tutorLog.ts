import Sequelize from "sequelize";
import { userModel } from "./users";

export interface ITutorLogModel {
    ID: number;
    UserID: number;
    TutorLogDate: Date;
    CheckIn: Date;
    CheckOut: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TutorLogInstance = Sequelize.Instance<ITutorLogModel> & ITutorLogModel;

// tslint:disable:object-literal-sort-keys
export function tutorLogModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ITutorLogModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        UserID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        TutorLogDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        CheckIn: {
            type: Sequelize.TIME,
            allowNull: true,
        },
        CheckOut: {
            type: Sequelize.TIME,
            allowNull: true,
        },
    };

    return sequalize.define<TutorLogInstance, ITutorLogModel>("TutorLog", attributes, {
        tableName: "TutorLog",
    });
}
