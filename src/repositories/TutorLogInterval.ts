import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ITutorLogIntervalModel, TutorLogIntervalInstance, tutorLogIntervalModel } from "../models/v1/tutorLogInterval";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class TutorLogInterval extends SequelizeModel<TutorLogIntervalInstance, ITutorLogIntervalModel> {

    public static getInstance(): TutorLogInterval {
        if (!this.instance) {
            this.instance = new TutorLogInterval();
        }
        return this.instance;
    }

    private static instance: TutorLogInterval;

    private constructor() {
        super();
        this.model = tutorLogIntervalModel(Connection.getInstance().getConnection());
    }

    public add(
        IntervalName: string,
        StartDate: Date,
    ): Observable<ITutorLogIntervalModel> {
        return from(this.model.create({ IntervalName, StartDate }));
    }

    public edit(
        ID: number,
        value: Partial<ITutorLogIntervalModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<ITutorLogIntervalModel>(value), { where: { ID } }))
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
