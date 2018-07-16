import Sequelize from "sequelize";

export interface ITopicModel {
    ID?: number;
    TopicSubj: string;
    Class: string;
    Topic: string;
    TopicName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TopicInstance = Sequelize.Instance<ITopicModel> & ITopicModel;

// tslint:disable:object-literal-sort-keys
export function topicModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<ITopicModel> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        TopicSubj: {
            type: Sequelize.STRING(1),
            allowNull: false,
        },
        Class: {
            type: Sequelize.STRING(1),
            allowNull: false,
        },
        Topic: {
            type: Sequelize.STRING(5),
            allowNull: false,
        },
        TopicName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    };

    return sequalize.define<TopicInstance, ITopicModel>("Topic", attributes, {
        tableName: "Topic",
    });
}
