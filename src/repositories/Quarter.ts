import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import Sequelize from "sequelize";
import { Connection } from "../models/Connection";
import { IQuarterModel, QuarterInstance, quarterModel, QuarterType } from "../models/v1/quarter";

export class Quarter {

    public static getInstance(): Quarter {
        if (!this.instance) {
            this.instance = new Quarter();
        }
        return this.instance;
    }

    private static instance: Quarter;

    private quarterModel: Sequelize.Model<QuarterInstance, IQuarterModel>;

    private constructor() {
        this.quarterModel = quarterModel(Connection.getInstance().getConnection());
    }

    public add(
        ID: number,
        QuarterName: string,
        // tslint:disable-next-line:no-shadowed-variable
        QuarterType: QuarterType,
        StartDate: Date,
        EndDate: Date,
    ): Observable<IQuarterModel> {
        return from(this.quarterModel.create({ ID, QuarterName, QuarterType, StartDate, EndDate }));
    }

    public defaultQuarter(
        type = QuarterType.normal,
    ): Observable<IQuarterModel | null> {
        return Connection.getInstance().query<IQuarterModel>(
            `SELECT * FROM Quarter WHERE StartDate < GETDATE() AND EndDate > GETDATE() AND Type = '${type}'`,
            { raw: true },
        ).pipe(
            map((result) => result.length === 0 ? null : result[0]),
        );
    }

    public list(): Observable<IQuarterModel[]> {
        return from(this.quarterModel.findAll({ raw: true }));
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.quarterModel.destroy({ where: { ID } }));
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
        return from(this.quarterModel.update(updateValue, { where: { ID } }))
            .pipe(
                map((quarter) => quarter[0]),
        );
    }
}
