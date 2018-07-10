import { from, Observable } from "../../node_modules/rxjs";
import { map } from "../../node_modules/rxjs/operators";
import { Connection } from "../models/Connection";
import { ClassRegInstance, classRegModel, IClassRegModel , RegStatus as Type } from "../models/v1/classReg";
import { SequelizeModel } from "./SequelizeModel";

export class ClassReg extends SequelizeModel<ClassRegInstance, IClassRegModel> {

    public static getInstance(): ClassReg {
        if (!this.instance) {
            this.instance = new ClassReg();
        }
        return this.instance;
    }

    private static instance: ClassReg;

    private constructor() {
        super();
        this.model = classRegModel(Connection.getInstance().getConnection());
    }

    public add(
        ID: number,
        StudentID: number,
        ClassID: number,
        RegStatus: Type,
    ): Observable<IClassRegModel> {
        return from(this.model.create({ ID, StudentID, ClassID, RegStatus }));
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }

    public edit(
        ID: number,
        value: Partial<IClassRegModel>,
    ): Observable<number> {
        let updateValue = {} as Partial<IClassRegModel>;
        if (value.RegStatus) {
            updateValue = { ...updateValue, RegStatus: value.RegStatus };
        }
        return from(this.model.update(updateValue, { where: { ID } }))
            .pipe(
                map((classReg) => classReg[0]),
        );
    }
}
