import { from, Observable, of } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { IStudentLevelModel, StudentLevelInstance, studentLevelModel } from "../models/v1/studentLevel";
import { Quarter } from "./Quarter";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class StudentLevel extends SequelizeModel<StudentLevelInstance, IStudentLevelModel> {

    public static getInstance(): StudentLevel {
        if (!this.instance) {
            this.instance = new StudentLevel();
        }
        return this.instance;
    }

    private static instance: StudentLevel;

    private constructor() {
        super();
        this.model = studentLevelModel(Connection.getInstance().getConnection());
    }

    public set(
        StudentID: number,
        ClassSubject: string,
        SubLevel: string,
        QuarterID?: number,
    ): Observable<IStudentLevelModel> {
        if (QuarterID) {
            return this.setValue(StudentID, ClassSubject, SubLevel, QuarterID);
        } else {
            return Quarter.getInstance().defaultQuarter().pipe(
                flatMap((quarter) => this.setValue(StudentID, ClassSubject, SubLevel, quarter.ID)),
            );
        }
    }

    // public get(
    //     StudentID: number,
    //     ClassSubject: string,
    //     QuarterID?: number,
    // ): Observable<string | null> {
    //     if (QuarterID) {
    //         return from(this.model.findOne<IStudentLevelModel>({ where: { StudentID, ClassSubject } }))
    //             .pipe(
    //                 map((result) => result.SubLevel),
    //         );
    //     } else {

    //     }
    // }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }

    public edit(
        ID: number,
        value: Partial<IStudentLevelModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<IStudentLevelModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }

    private setValue(
        StudentID: number,
        ClassSubject: string,
        SubLevel: string,
        QuarterID: number,
    ): Observable<IStudentLevelModel> {
        return from(this.model.findOrCreate(
            {
                defaults: { StudentID, ClassSubject, QuarterID, SubLevel },
                where: { StudentID, ClassSubject },
            })).pipe(
                flatMap(([level, created]) => {
                    if (created) {
                        return of(level.get({
                            plain: true,
                        }));
                    } else {
                        return from(level.update("SubLevel", SubLevel));
                    }
                }),
        );
    }
}
