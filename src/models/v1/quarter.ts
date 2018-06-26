import Sequelize from "sequelize";

export enum QuarterType {
    normal = "normal",
    summer = "summer",
}

export interface IQuarterModel {
    ID: number;
    QuarterName: string;
    Type: QuarterType;
    StartDate: Date;
    EndDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export type QuarterInstance = Sequelize.Instance<IQuarterModel> & IQuarterModel;

// tslint:disable:object-literal-sort-keys
export function quarterModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IQuarterModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        QuarterName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Type: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        StartDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        EndDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    };
    return sequalize.define<QuarterInstance, IQuarterModel>("Quarter", attributes, {
        tableName: "Quarter",
    });
}
