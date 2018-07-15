import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { DetailType as Type, ITutorLogDetailModel, TutorLogDetailInstance, tutorLogDetailModel } from "../models/v1/tutorLogDetail";
import { SequelizeModel } from "./SequelizeModel";

export class TutorLogDetail extends SequelizeModel<TutorLogDetailInstance, ITutorLogDetailModel> {

    public static getInstance(): TutorLogDetail {
        if (!this.instance) {
            this.instance = new TutorLogDetail();
        }
        return this.instance;
    }

    private static instance: TutorLogDetail;

    private constructor() {
        super();
        this.model = tutorLogDetailModel(Connection.getInstance().getConnection());
    }

    public add(
        TutorLogID: number,
        DetailType: Type,
    ): Observable<ITutorLogDetailModel> {
        return from(this.model.create({
            DetailType,
            TutorLogID,
        }));
    }

    public edit(
        ID: number,
        DetailType: Type,
    ): Observable<number> {
        return from(this.model.update({ DetailType }, { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }
}
