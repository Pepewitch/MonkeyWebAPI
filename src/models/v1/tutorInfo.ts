import Sequelize from "sequelize";
import { userModel } from "./users";

export interface ITutorInfoModel {
    ID: number;
    Position: string;
    createAt: Date;
    updatedAt: Date;
}

export type TutorInfoInstance = Sequelize.Instance<ITutorInfoModel> & ITutorInfoModel;

// tslint:disable:object-literal-sort-keys
export function tutorInfoModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ITutorInfoModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        Position: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        createAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    };

    return sequalize.define<TutorInfoInstance, ITutorInfoModel>("TutorInfo", attributes, {
        tableName: "TutorInfo",
    });
}
