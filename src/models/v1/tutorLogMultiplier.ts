import Sequelize from "sequelize";
import { tutorLogIntervalModel } from "./tutorLogInterval";
import { userModel } from "./users";

export interface ITutorLogMultiplierModel {
    ID: number;
    UserID: number;
    TutorLogIntervalID: number;
    Multiplier: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TutorLogMultiplierInstance = Sequelize.Instance<ITutorLogMultiplierModel> & ITutorLogMultiplierModel;

// tslint:disable:object-literal-sort-keys
export function tutorLogMultiplierModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ITutorLogMultiplierModel> = {
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
        TutorLogIntervalID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: tutorLogIntervalModel(sequalize),
                key: "ID",
            },
        },
        Multiplier: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    };

    return sequalize.define<TutorLogMultiplierInstance, ITutorLogMultiplierModel>("TutorLogMultiplier", attributes, {
        tableName: "TutorLogMultiplier",
    });
}
