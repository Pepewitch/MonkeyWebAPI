import { Connection } from "../models/Connection";
import { ISubmissionModel, SubmissionInstance, submissionModel } from "../models/v1/submission";
import { SequelizeModel } from "./SequelizeModel";

export class Submission extends SequelizeModel<SubmissionInstance, ISubmissionModel> {

    public static getInstance(): Submission {
        if (!this.instance) {
            this.instance = new Submission();
        }
        return this.instance;
    }

    private static instance: Submission;

    private constructor() {
        super();
        this.model = submissionModel(Connection.getInstance().getConnection());
    }
}
