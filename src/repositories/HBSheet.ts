import { Connection } from "../models/Connection";
import { HBSheetInstance, hbSheetModel, IHBSheetModel } from "../models/v1/HBSheet";
import { SequelizeModel } from "./SequelizeModel";
import { Observable, from } from "rxjs";

export class HBSheet extends SequelizeModel<HBSheetInstance, IHBSheetModel> {

    public static getInstance(): HBSheet {
        if (!this.instance) {
            this.instance = new HBSheet();
        }
        return this.instance;
    }

    private static instance: HBSheet;

    private constructor() {
        super();
        this.model = hbSheetModel(Connection.getInstance().getConnection());
    }
    public add(
        TopicID: number,
        SheetLevel: string,
        SheetNumber: number,
        Rev: number,
    ): Observable<IHBSheetModel> {
        return from(this.model.create({ TopicID, SheetLevel, SheetNumber, Rev }));
    }
}
