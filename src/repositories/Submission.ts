import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ISubmissionModel, SubmissionInstance, submissionModel, SubmissionState } from "../models/v1/submission";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

interface IClassSubmission {
    ID: number;
    lecture: number;
    title: string;
    message: string;
    status: string;
    files: Array<{
        name: string;
        url: string;
    }>;
}

interface IClassSubmissionQuery {
    ID: number;
    SubmissionTimes: number;
    SubmissionName: string;
    ChatMessage: string;
    SubmissionState: SubmissionState;
}

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

    public addTitle(
        ClassID: number,
        SubmissionTimes: number,
        SubmissionName: string,
    ): Observable<ISubmissionModel> {
        return from(this.model.create({
            ClassID,
            SubmissionName,
            SubmissionState: SubmissionState.empty,
            SubmissionTimes,
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

    public get(
        ClassID: number,
    ): Observable<IClassSubmission[]> {
        return Connection.getInstance().select<IClassSubmissionQuery>(
            `SELECT
                Submission.ID,
                Submission.SubmissionTimes,
                Submission.SubmissionName,
                SubmissionChat.ChatMessage,
                Submission.SubmissionState
            FROM
                Submission
                    LEFT JOIN
                SubmissionChat ON (Submission.ID = SubmissionChat.SubmissionID
                    AND SubmissionChat.Visibility = 'show'
                    AND SubmissionChat.ID = (SELECT
                        MAX(ID)
                    FROM
                        SubmissionChat
                    WHERE
                        SubmissionChat.SubmissionID = Submission.ID))
            WHERE
                ClassID = :ClassID`, {
                replacements: { ClassID },
            },
        ).pipe(
            map((results) => {
                return results.map((result) => {
                    return {
                        ID: result.ID,
                        files: [],
                        lecture: result.SubmissionTimes,
                        message: result.ChatMessage,
                        status: result.SubmissionState,
                        title: result.SubmissionName,
                    };
                });
            }),
        );
    }
    private checkExist(
        ClassID: number,
        SubmissionTimes: number,
    ): Observable<boolean> {
        return from(this.model.findAll<ISubmissionModel>({ where: { ClassID, SubmissionTimes } }))
            .pipe(
                map((result) => result.length !== 0),
        );
    }
}
