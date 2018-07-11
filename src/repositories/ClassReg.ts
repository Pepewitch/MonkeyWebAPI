import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
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
        StudentID: number,
        ClassID: number,
        RegStatus: Type,
    ): Observable<IClassRegModel> {
        return from(this.model.create({ StudentID, ClassID, RegStatus }));
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }

    public edit(
        ID: number,
        RegStatus: Type,
    ): Observable<number> {
        return from(this.model.update( { RegStatus }, { where: { ID } }))
            .pipe(
                map((classReg) => classReg[0]),
            );
    }
}
