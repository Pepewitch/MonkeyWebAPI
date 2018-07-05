import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { IQuarterModel, QuarterInstance, quarterModel, QuarterType } from "../models/v1/quarter";
import { SequelizeModel } from "./SequelizeModel";

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
        // tslint:disable-next-line:no-shadowed-variable
        QuarterType: QuarterType,
        StartDate: Date,
        EndDate: Date,
    ): Observable<IQuarterModel> {
        return from(this.model.create({ ID, QuarterName, QuarterType, StartDate, EndDate }));
    }

    public defaultQuarter(
        type = QuarterType.normal,
    ): Observable<IQuarterModel> {
        return Connection.getInstance().select<IQuarterModel>(
            `SELECT * FROM Quarter WHERE StartDate < GETDATE() AND EndDate > GETDATE() AND QuarterType = :type`,
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

    public list(): Observable<IQuarterModel[]> {
        return from(this.model.findAll({ raw: true }));
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
        let updateValue = {} as Partial<IQuarterModel>;
        if (value.StartDate) {
            updateValue = { ...updateValue, StartDate: value.StartDate };
        }
        if (value.EndDate) {
            updateValue = { ...updateValue, EndDate: value.EndDate };
        }
        if (value.QuarterName) {
            updateValue = { ...updateValue, QuarterName: value.QuarterName };
        }
        return from(this.model.update(updateValue, { where: { ID } }))
            .pipe(
                map((quarter) => quarter[0]),
        );
    }
}
