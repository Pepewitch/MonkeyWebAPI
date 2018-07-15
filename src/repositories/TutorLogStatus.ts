import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ITutorLogStatusModel, TutorLogStatus as Type, TutorLogStatusInstance, tutorLogStatusModel } from "../models/v1/tutorLogStatus";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class TutorLogStatus extends SequelizeModel<TutorLogStatusInstance, ITutorLogStatusModel> {

    public static getInstance(): TutorLogStatus {
        if (!this.instance) {
            this.instance = new TutorLogStatus();
        }
        return this.instance;
    }

    private static instance: TutorLogStatus;

    private constructor() {
        super();
        this.model = tutorLogStatusModel(Connection.getInstance().getConnection());
    }

    public add(
        UserID: number,
        TutorLogIntervalID: number,
        LogStatus: Type,
    ): Observable<ITutorLogStatusModel> {
        return from(this.model.create({ UserID, TutorLogIntervalID, TutorLogStatus: LogStatus }));
    }

    public edit(
        ID: number,
        value: Partial<ITutorLogStatusModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<ITutorLogStatusModel>(value), { where: { ID } }))
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
