import Sequelize from "sequelize";
import { tutorLogModel } from "./tutorLog";

export enum DetailType {
    hybrid = "hybrid",
    course = "course",
    sheet = "sheet",
    reading = "reading",
    meeting = "meeting",
    admin = "admin",
    developer = "developer",
}

export interface ITutorLogDetailModel {
    ID: number;
    TutorLogID: number;
    DetailType: DetailType;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TutorLogDetailInstance = Sequelize.Instance<ITutorLogDetailModel> & ITutorLogDetailModel;

// tslint:disable:object-literal-sort-keys
export function tutorLogDetailModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ITutorLogDetailModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        TutorLogID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: tutorLogModel(sequalize),
                key: "ID",
            },
        },
        DetailType: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
    };

    return sequalize.define<TutorLogDetailInstance, ITutorLogDetailModel>("TutorLogDetail", attributes, {
        tableName: "TutorLogDetail",
    });
}
