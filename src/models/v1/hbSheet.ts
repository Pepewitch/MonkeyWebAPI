import Sequelize from "sequelize";
import { topicModel } from "./topic";

// SheetPath ??

export interface IHBSheetModel {
    ID: number;
    TopicID: number;
    SheetLevel: string;
    SheetNumber: number;
    SubLevel?: string;
    Rev: number;
    SheetPath?: string;
    createAt?: Date;
    updatedAt?: Date;
}

export type HBSheetInstance = Sequelize.Instance<IHBSheetModel> & IHBSheetModel;

// tslint:disable:object-literal-sort-keys
export function hbSheetModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IHBSheetModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        TopicID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: topicModel(sequalize),
                key: "ID",
            },
        },
        SheetLevel: {
            type: Sequelize.STRING(1),
            allowNull: false,
        },
        SheetNumber: {
            type: Sequelize.NUMERIC(2, 0),
            allowNull: false,
        },
        SubLevel: {
            type: Sequelize.STRING(2),
            allowNull: true,
        },
        Rev: {
            type: Sequelize.NUMERIC(2, 1),
            allowNull: false,
        },
        SheetPath: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    };

    return sequalize.define<HBSheetInstance, IHBSheetModel>("HBSheet", attributes, {
        tableName: "HBSheet",
    });
}
