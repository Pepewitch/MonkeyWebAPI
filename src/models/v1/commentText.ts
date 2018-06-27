import Sequelize from "sequelize";

// Ask Tao for CommentType
export enum CommentType {
}

export interface ICommentTextModel {
    ID: number;
    Text: string;
    Type: CommentType;
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
        Text: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Type: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
    };

    return sequalize.define<CommentTextInstance, ICommentTextModel>("CommentText", attributes, {
        tableName: "CommentText",
    });
}
