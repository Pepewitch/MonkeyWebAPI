import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { Visibility } from "../models/util/context";
import { IReceiptModel, ReceiptInstance, receiptModel } from "../models/v1/receipt";
import { FileManager } from "./FileManager";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class Receipt extends SequelizeModel<ReceiptInstance, IReceiptModel> {

    public static getInstance(): Receipt {
        if (!this.instance) {
            this.instance = new Receipt();
        }
        return this.instance;
    }

    private static instance: Receipt;

    private constructor() {
        super();
        this.model = receiptModel(Connection.getInstance().getConnection());
    }

    public add(
        StudentID: number,
        file: Express.Multer.File,
        QuarterID?: number,
    ): Observable<IReceiptModel> {
        let insertResult: IReceiptModel;
        return from(this.model.create({ StudentID, QuarterID, Visibility: Visibility.show })).pipe(
            flatMap((result) => {
                insertResult = result;
                return FileManager.getInstance().uploadReceipt(result.ID, file);
            }),
            map((_) => insertResult),
        );
    }

    public edit(
        ID: number,
        value: IReceiptModel,
    ): Observable<number> {
        return from(this.model.update(partialOf<IReceiptModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return FileManager
            .getInstance()
            .deleteReceipt(ID)
            .pipe(
                flatMap((_) => {
                    return from(this.model.destroy({ where: { ID } }));
                }),
            );
    }
}
