import Sequelize from "sequelize";
import { tutorLogIntervalModel } from "./tutorLogInterval";
import { userModel } from "./users";

export interface ITutorLogExtraCashFlowModel {
    ID: number;
    UserID: number;
    TutorLogIntervalID: number;
    Note?: string;
    ExtraCashFlow: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ITutorLogExtraCashFlowInstance = Sequelize.Instance<ITutorLogExtraCashFlowModel> & ITutorLogExtraCashFlowModel;

// tslint:disable:object-literal-sort-keys
export function tutorInfoModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ITutorLogExtraCashFlowModel> = {
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
        Note: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ExtraCashFlow: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    };

    return sequalize.define<ITutorLogExtraCashFlowInstance, ITutorLogExtraCashFlowModel>("TutorLogExtraCashFlow", attributes, {
        tableName: "TutorLogExtraCashFlow",
    });
}
