import Sequelize from "sequelize";
import { commentTextModel } from "./commentText";
import { quarterModel } from "./quarter";
import { userModel } from "./users";

export interface ICommentModel {
    ID: number;
    StudentID: number;
    CommentTextID: number;
    QuarterID: number;
    SenderID: number;
    Remark?: string;
    createAt?: Date;
    updatedAt?: Date;
}

export type CommentInstance = Sequelize.Instance<ICommentModel> & ICommentModel;

// tslint:disable:object-literal-sort-keys
export function commentModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ICommentModel> = {
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
        CommentTextID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: commentTextModel(sequalize),
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
        SenderID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: userModel(sequalize),
                key: "ID",
            },
        },
        Remark: {
            type: Sequelize.STRING(10),
            allowNull: true,
        },
    };

    return sequalize.define<CommentInstance, ICommentModel>("Comment", attributes, {
        tableName: "Comment",
    });
}
