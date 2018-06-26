import Sequelize from "sequelize";
import { Visibility } from "../util/context";
import { submissionModel } from "./submission";
import { userModel } from "./users";

export interface ISubmissionChatModel {
    ID: number;
    SubmissionID: number;
    ChatMessage: string;
    SenderID: number;
    Visibility: Visibility;
    createAt?: Date;
    updatedAt?: Date;
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
            allowNull: false,
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

    return sequalize.define<SubmissionChatInstance, ISubmissionChatModel>("SubmissionChat", attributes, {
        tableName: "SubmissionChat",
    });
}
