import Sequelize from "sequelize";
import { hbSheetModel } from "./hbSheet";
import { userModel } from "./users";

export interface IPortfolioModel {
    ID: number;
    StudentID: number;
    HBSheetID: number;
    StartDate?: Date;
    EndDate?: Date;
    Score?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type PortfolioInstance = Sequelize.Instance<IPortfolioModel> & IPortfolioModel;

// tslint:disable:object-literal-sort-keys
export function portfolioModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IPortfolioModel> = {
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
        HBSheetID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: hbSheetModel(sequalize),
                key: "ID",
            },
        },
        StartDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        EndDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        Score: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    };

    return sequalize.define<PortfolioInstance, IPortfolioModel>("Portfolio", attributes, {
        tableName: "Portfolio",
    });
}
