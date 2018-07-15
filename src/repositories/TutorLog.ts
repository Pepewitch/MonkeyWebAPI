import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ITutorLogModel, TutorLogInstance, tutorLogModel } from "../models/v1/tutorLog";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class TutorLog extends SequelizeModel<TutorLogInstance, ITutorLogModel> {

    public static getInstance(): TutorLog {
        if (!this.instance) {
            this.instance = new TutorLog();
        }
        return this.instance;
    }

    private static instance: TutorLog;

    private constructor() {
        super();
        this.model = tutorLogModel(Connection.getInstance().getConnection());
    }

    public add(
        UserID: number,
        Time: Date,
    ): Observable<ITutorLogModel> {
        return from(this.model.create({
            CheckIn: Time,
            TutorLogDate: Time,
            UserID,
        }));
    }

    public edit(
        ID: number,
        value: Partial<ITutorLogModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<ITutorLogModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }

}
