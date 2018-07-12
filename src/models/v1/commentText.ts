import Sequelize from "sequelize";

export enum CommentType {
    comments = "comments",
    compliments = "compliments",
}

export interface ICommentTextModel {
    ID: number;
    CommentText: string;
    CommentType: CommentType;
}

export type CommentTextInstance = Sequelize.Instance<ICommentTextModel> & ICommentTextModel;

// tslint:disable:object-literal-sort-keys
export function commentTextModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ICommentTextModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        CommentText: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        CommentType: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
    };

    return sequalize.define<CommentTextInstance, ICommentTextModel>("CommentText", attributes, {
        tableName: "CommentText",
        timestamps: false,
    });
}
