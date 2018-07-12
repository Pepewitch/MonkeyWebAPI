import Sequelize from "sequelize";
import { tutorLogIntervalModel } from "./tutorLogInterval";
import { userModel } from "./users";

export enum TutorLogStatus {
    waiting = "waiting",
    done = "done",
}

export interface ITutorLogStatusModel {
    ID: number;
    UserID: number;
    TutorLogIntervalID: number;
    TutorLogStatus: TutorLogStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TutorLogStatusInstance = Sequelize.Instance<ITutorLogStatusModel> & ITutorLogStatusModel;

// tslint:disable:object-literal-sort-keys
export function tutorLogStatusModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ITutorLogStatusModel> = {
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
        TutorLogStatus: {
            type: Sequelize.STRING(20),
            allowNull: false,
            defaultValue: TutorLogStatus.waiting,
        },
    };

    return sequalize.define<TutorLogStatusInstance, ITutorLogStatusModel>("TutorLogStatus", attributes, {
        tableName: "TutorLogStatus",
    });
}
