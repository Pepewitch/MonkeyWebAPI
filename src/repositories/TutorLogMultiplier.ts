import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ITutorLogMultiplierModel, TutorLogMultiplierInstance, tutorLogMultiplierModel } from "../models/v1/tutorLogMultiplier";
import { SequelizeModel } from "./SequelizeModel";

export class TutorLogMultiplier extends SequelizeModel<TutorLogMultiplierInstance, ITutorLogMultiplierModel> {

    public static getInstance(): TutorLogMultiplier {
        if (!this.instance) {
            this.instance = new TutorLogMultiplier();
        }
        return this.instance;
    }

    private static instance: TutorLogMultiplier;

    private constructor() {
        super();
        this.model = tutorLogMultiplierModel(Connection.getInstance().getConnection());
    }

    public add(
        UserID: number,
        TutorLogIntervalID: number,
        Multiplier: number,
    ): Observable<ITutorLogMultiplierModel> {
        return from(this.model.create({ UserID, TutorLogIntervalID, Multiplier }));
    }

    public edit(
        ID: number,
        Multiplier: number,
    ): Observable<number> {
        return from(this.model.update({ Multiplier }, { where: { ID } }))
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
