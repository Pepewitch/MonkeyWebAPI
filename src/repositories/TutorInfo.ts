import { Connection } from "../models/Connection";
import { ITutorInfoModel, TutorInfoInstance, tutorInfoModel } from "../models/v1/tutorInfo";
import { SequelizeModel } from "./SequelizeModel";

export class TutorInfo extends SequelizeModel<TutorInfoInstance, ITutorInfoModel> {

    public static getInstance(): TutorInfo {
        if (!this.instance) {
            this.instance = new TutorInfo();
        }
        return this.instance;
    }

    private static instance: TutorInfo;

    private constructor() {
        super();
        this.model = tutorInfoModel(Connection.getInstance().getConnection());
    }

    // TODO: Add method for get set
}
