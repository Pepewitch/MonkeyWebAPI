import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { IQuarterModel, QuarterInstance, quarterModel, QuarterType as Type } from "../models/v1/quarter";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class Quarter extends SequelizeModel<QuarterInstance, IQuarterModel> {

    public static getInstance(): Quarter {
        if (!this.instance) {
            this.instance = new Quarter();
        }
        return this.instance;
    }

    private static instance: Quarter;

    private constructor() {
        super();
        this.model = quarterModel(Connection.getInstance().getConnection());
    }

    public add(
        ID: number,
        QuarterName: string,
        QuarterType: Type,
        StartDate: Date,
        EndDate: Date,
    ): Observable<IQuarterModel> {
        return from(this.model.create({ ID, QuarterName, QuarterType, StartDate, EndDate }));
    }

    public defaultQuarter(
        type = Type.normal,
    ): Observable<IQuarterModel> {
        return Connection.getInstance().select<IQuarterModel>(
            `SELECT * FROM Quarter WHERE StartDate < NOW() AND EndDate > NOW() AND QuarterType = :type`,
            {
                replacements: { type },
            },
        ).pipe(
            map((result) => {
                if (result.length === 0) {
                    throw new Error("Default quarter not found");
                }
                return result[0];
            }),
        );
    }

    public list(QuarterType?: Type): Observable<IQuarterModel[]> {
        if (QuarterType) {
            return from(this.model.findAll({ where: { QuarterType }, raw: true }));
        } else {
            return from(this.model.findAll({ raw: true }));
        }
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }

    public edit(
        ID: number,
        value: Partial<IQuarterModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<IQuarterModel>(value), { where: { ID } }))
            .pipe(
                map((quarter) => quarter[0]),
        );
    }
}
