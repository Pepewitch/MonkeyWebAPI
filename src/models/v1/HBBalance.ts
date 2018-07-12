import Sequelize from "sequelize";
import { classLogModel } from "./classLog";

export interface IHBBalanceModel {
    ID: number;
    HBTransaction: number;
    ClassLogID?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type HBBalanceInstance = Sequelize.Instance<IHBBalanceModel> & IHBBalanceModel;

// tslint:disable:object-literal-sort-keys
export function hbBalanceModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IHBBalanceModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        HBTransaction: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        ClassLogID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: classLogModel(sequalize),
                key: "ID",
            },
        },
    };

    return sequalize.define<HBBalanceInstance, IHBBalanceModel>("HBBalance", attributes, {
        tableName: "HBBalance",
    });
}
