import Sequelize from "sequelize";
import { quarterModel } from "./quarter";
import { userModel } from "./users";

export interface IReceiptModel {
    ID: number;
    StudentID: number;
    QuarterID: number;
    Visibility: string;
    createAt: Date;
    updatedAt: Date;
}

export type ReceiptInstance = Sequelize.Instance<IReceiptModel> & IReceiptModel;

// tslint:disable:object-literal-sort-keys
export function receiptModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IReceiptModel> = {
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
        QuarterID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: quarterModel(sequalize),
                key: "ID",
            },
        },
        Visibility: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        createAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    };

    return sequalize.define<ReceiptInstance, IReceiptModel>("Receipt", attributes, {
        tableName: "Receipt",
    });
}
