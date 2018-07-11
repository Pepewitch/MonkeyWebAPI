import Sequelize from "sequelize";
import { Visibility } from "../util/context";
import { quarterModel } from "./quarter";
import { userModel } from "./users";

export interface IRegChatModel {
    ID?: number;
    StudentID: number;
    ChatMessage: string;
    QuarterID: number;
    SenderID: number;
    Visibility: Visibility;
    createdAt?: Date;
    updatedAt?: Date;
}

export type RegChatInstance = Sequelize.Instance<IRegChatModel> & IRegChatModel;

// tslint:disable:object-literal-sort-keys
export function regChatModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IRegChatModel> = {
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
        ChatMessage: {
            type: Sequelize.STRING,
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
        SenderID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        Visibility: {
            type: Sequelize.STRING(10),
            allowNull: false,
            defaultValue: Visibility.show,
        },
    };

    return sequalize.define<RegChatInstance, IRegChatModel>("RegChat", attributes, {
        tableName: "RegChat",
    });
}
