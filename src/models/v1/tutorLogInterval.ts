import Sequelize from "sequelize";

export interface ITutorLogIntervalModel {
    ID?: number;
    IntervalName: string;
    StartDate: Date;
    EndDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TutorLogIntervalInstance = Sequelize.Instance<ITutorLogIntervalModel> & ITutorLogIntervalModel;

// tslint:disable:object-literal-sort-keys
export function tutorLogIntervalModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ITutorLogIntervalModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        IntervalName: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        StartDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        EndDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    };

    return sequalize.define<TutorLogIntervalInstance, ITutorLogIntervalModel>("TutorLogInterval", attributes, {
        tableName: "TutorLogInterval",
    });
}
