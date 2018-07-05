import { from, Observable } from "rxjs";
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
}
