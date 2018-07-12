import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { Visibility } from "../models/util/context";
import { AttendanceInstance, attendanceModel, AttendanceType as Type, IAttendanceModel } from "../models/v1/attendance";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class Attendance extends SequelizeModel<AttendanceInstance, IAttendanceModel> {

    public static getInstance(): Attendance {
        if (!this.instance) {
            this.instance = new Attendance();
        }
        return this.instance;
    }

    private static instance: Attendance;

    private constructor() {
        super();
        this.model = attendanceModel(Connection.getInstance().getConnection());
    }

    public add(
        StudentID: number,
        ClassID: number,
        AttendanceDate: Date,
        AttendanceType: Type,
        Reason: string,
        Sender: string,
    ): Observable<IAttendanceModel> {
        return from(this.model.create({ StudentID, ClassID, AttendanceDate, AttendanceType, Reason, Sender, Visibility: Visibility.show }));
    }

    public edit(
        ID: number,
        value: Partial<IAttendanceModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<IAttendanceModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }
}
