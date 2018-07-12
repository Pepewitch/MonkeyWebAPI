import Sequelize from "sequelize";

export abstract class SequelizeModel<Instance, Model> {
    protected model: Sequelize.Model<Instance, Model>;
}
