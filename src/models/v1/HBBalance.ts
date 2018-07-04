import Sequelize from "sequelize";
import { classLogModel } from "./classLog";

export interface IHBBalaceModel {
    ID: number;
    HBTransaction: number;
    ClassLogID?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type HBBalaceInstance = Sequelize.Instance<IHBBalaceModel> & IHBBalaceModel;

// tslint:disable:object-literal-sort-keys
export function hbBalaceModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IHBBalaceModel> = {
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

    return sequalize.define<HBBalaceInstance, IHBBalaceModel>("HBBalance", attributes, {
        tableName: "HBBalance",
    });
}
