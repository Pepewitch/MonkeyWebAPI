import Sequelize from "sequelize";
import { quarterModel } from "./quarter";

export interface IRoomModel {
    ID?: number;
    RoomName: string;
    QuarterID: number;
    MaxSeat: number;
    createAt?: Date;
    updatedAt?: Date;
}

export type RoomInstance = Sequelize.Instance<IRoomModel> & IRoomModel;

// tslint:disable:object-literal-sort-keys
export function roomModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IRoomModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        RoomName: {
            type: Sequelize.STRING(16),
            allowNull: false,
        },
        QuarterID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: quarterModel(sequalize),
                key: "ID",
            },
        },
        MaxSeat: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    };

    return sequalize.define<RoomInstance, IRoomModel>("Room", attributes, {
        tableName: "Room",
    });
}
