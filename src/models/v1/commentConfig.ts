import Sequelize from "sequelize";
import { commentTextModel } from "./commentText";
import { userModel } from "./users";

export interface ICommentConfigModel {
    ID: number;
    UserID: number;
    CommentTextID: number;
    ConfigOrder: number;
}

export type CommentConfigInstance = Sequelize.Instance<ICommentConfigModel> & ICommentConfigModel;

// tslint:disable:object-literal-sort-keys
export function commentConfigModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ICommentConfigModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        UserID: {
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
        ConfigOrder: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: -1,
        },
    };

    return sequalize.define<CommentConfigInstance, ICommentConfigModel>("CommentConfig", attributes, {
        tableName: "CommentConfig",
        timestamps: false,
    });
}
