import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { IStudentInfoModel, StudentInfoInstance, studentInfoModel } from "../models/v1/studentInfo";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class StudentInfo extends SequelizeModel<StudentInfoInstance, IStudentInfoModel> {

    public static getInstance(): StudentInfo {
        if (!this.instance) {
            this.instance = new StudentInfo();
        }
        return this.instance;
    }

    private static instance: StudentInfo;

    private constructor() {
        super();
        this.model = studentInfoModel(Connection.getInstance().getConnection());
    }

    public set(
        ID: number,
        value: Partial<IStudentInfoModel>,
    ): Observable<number> {
        let setValue = partialOf<IStudentInfoModel>(value);
        return this.checkExist(ID)
            .pipe(
                flatMap((isExist) => {
                    if (isExist) {
                        return from(this.model.update(setValue, { where: { ID } }))
                            .pipe(
                                map((studentInfo) => studentInfo[0]),
                        );
                    } else {
                        setValue = { ...setValue, ID };
                        return from(this.model.create(setValue as IStudentInfoModel))
                            .pipe(
                                map((_) => 1),
                        );
                    }
                }),
        );
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }

    private checkExist(ID: number): Observable<boolean> {
        return from(this.model.findOne({ where: { ID }, raw: true })).pipe(
            map((result) => result != null),
        );
    }
}
