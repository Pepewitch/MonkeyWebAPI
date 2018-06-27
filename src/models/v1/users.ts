import Sequelize from "sequelize";

export enum UserStatus {
    active = "active",
    inactive = "inactive",
    terminated = "terminated",
    archive = "archive",
}

export enum UserPosition {
    student = "student",
    tutor = "tutor",
    admin = "admin",
    dev = "dev",
    mel = "mel",
}

export interface IUser {
    ID: number;
    Firstname?: string;
    Lastname?: string;
    Nickname?: string;
    FirstnameEn?: string;
    LastnameEn?: string;
    NicknameEn?: string;
    Email?: string;
    Phone?: string;
    UserStatus: UserStatus;
    Position: UserPosition;
    UserPassword?: string;
    createAt?: Date;
    updatedAt?: Date;
}

export type UserInstance = Sequelize.Instance<IUser> & IUser;

// tslint:disable:object-literal-sort-keys
export function userModel(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<IUser> = {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        Firstname: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        Lastname: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        Nickname: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        FirstnameEn: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        LastnameEn: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        NicknameEn: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        Email: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        Phone: {
            type: Sequelize.STRING(16),
            allowNull: true,
        },
        UserStatus: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        Position: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        UserPassword: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    };
    return sequalize.define<UserInstance, IUser>("Users", attributes, {
        tableName: "Users",
    });
}
