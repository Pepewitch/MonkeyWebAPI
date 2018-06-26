import Sequelize from "sequelize";
import { quarterModel } from "./quarter";
import { userModel } from "./users";

export enum Visibility {
    show = "show",
    hide = "hide",
}

export interface IRegChatModel {
    ID: number;
    StudentID: number;
    ChatMessage: string;
    QuarterID: number;
    SenderID: number;
    Visibility: Visibility;
    createAt: Date;
    updatedAt: Date;
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
            defaultValue: "show",
        },
        createAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    };

    return sequalize.define<RegChatInstance, IRegChatModel>("RegistrationChat", attributes, {
        tableName: "RegistrationChat",
    });
}
