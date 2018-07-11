import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ISubmissionModel, SubmissionInstance, submissionModel, SubmissionState } from "../models/v1/submission";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

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

    public add(
        ClassID: number,
        SubmissionTimes: number,
        files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[],
    ): Observable<ISubmissionModel> {
        return from(this.model.create({
            ClassID, SubmissionState: SubmissionState.pending, SubmissionTimes,
        }));
    }

    public edit(
        ID: number,
        value: Partial<ISubmissionModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<ISubmissionModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }
}
