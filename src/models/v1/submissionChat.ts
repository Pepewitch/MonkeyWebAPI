import Sequelize from "sequelize";
import { submissionModel } from "./submission";
import { userModel } from "./users";

export interface ISubmissionChatModel {
    ID: number;
    SubmissionID: number;
    ChatMessage?: string;
    SenderID: number;
    SendTime: Date;
    Visibility: string;
    createAt: Date;
    updatedAt: Date;
}

export type SubmissionChatInstance = Sequelize.Instance<ISubmissionChatModel> & ISubmissionChatModel;

// tslint:disable:object-literal-sort-keys
export function SubmissionChatModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ISubmissionChatModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        SubmissionID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: submissionModel(sequalize),
                key: "ID",
            },
        },
        ChatMessage: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        SenderID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        SendTime: {
            type: Sequelize.DATE,
            allowNull: true,
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

    return sequalize.define<SubmissionChatInstance, ISubmissionChatModel>("SubmissionChat", attributes, {
        tableName: "SubmissionChat",
    });
}
