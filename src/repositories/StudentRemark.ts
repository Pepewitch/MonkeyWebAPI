import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { IStudentRemarkModel, StudentRemarkInstance, studentRemarkModel } from "../models/v1/studentRemark";
import { IStudentStateModel } from "../models/v1/studentState";
import { Quarter } from "./Quarter";
import { SequelizeModel } from "./SequelizeModel";

export class StudentRemark extends SequelizeModel<StudentRemarkInstance, IStudentRemarkModel> {

    public static getInstance(): StudentRemark {
        if (!this.instance) {
            this.instance = new StudentRemark();
        }
        return this.instance;
    }

    private static instance: StudentRemark;

    private constructor() {
        super();
        this.model = studentRemarkModel(Connection.getInstance().getConnection());
    }

    public set(
        StudentID: number,
        Remark: string,
        QuarterID?: number,
    ): Observable<number> {
        if (QuarterID) {
            return this.checkExist(StudentID, QuarterID).pipe(
                flatMap((isExist) => {
                    if (isExist) {
                        return from(this.model.update(
                            { Remark },
                            { where: { QuarterID, StudentID } },
                        )).pipe(
                            map((result) => result[0]),
                        );
                    } else {
                        return from(this.model.create(
                            { QuarterID, Remark, StudentID },
                        )).pipe(
                            map((_) => 1),
                        );
                    }
                }),
            );
        } else {
            return this.checkExistWithDefaultQuarter(StudentID).pipe(
                flatMap((isExist) => {
                    if (isExist) {
                        return Connection.getInstance().query<number>(
                            `UPDATE StudentRemark
                            SET Remark = :Remark, updatedAt = GETDATE()
                            FROM StudentRemark
                                JOIN Quarter ON QuarterID = Quarter.ID
                            WHERE StudentID = :StudentID AND StartDate < GETDATE() AND EndDate > GETDATE() AND QuarterType = 'normal';`, {
                                replacements: {
                                    Remark, StudentID,
                                },
                            },
                        ).pipe(
                            map((result) => result[0]),
                        );
                    } else {
                        return Quarter.getInstance().defaultQuarter().pipe(
                            flatMap((quarter) => {
                                return from(this.model.create({
                                    QuarterID: quarter.ID,
                                    Remark,
                                    StudentID,
                                })).pipe(
                                    map((_) => 1),
                                );
                            }),
                        );
                    }
                }),
            );
        }
    }

    public get(
        StudentID: number,
        QuarterID?: number,
    ): Observable<string> {
        if (QuarterID) {
            return from(this.model.findOne<IStudentStateModel>({ where: { QuarterID, StudentID } })).pipe(
                map((result) => {
                    if (!result) {
                        throw new Error(`StudentRemark of studentID: '${StudentID}' in quarterID: '${QuarterID}' not found`);
                    }
                    return result.Remark;
                }),
            );
        } else {
            return Connection.getInstance().select<IStudentRemarkModel>(
                `SELECT TOP(1) Remark
                FROM StudentRemark
                    JOIN Quarter ON QuarterID = Quarter.ID
                WHERE StudentID = :StudentID AND StartDate < GETDATE() AND EndDate > GETDATE() AND QuarterType = 'normal';`,
                { replacements: { StudentID } },
            ).pipe(
                map((result) => {
                    if (result.length === 0) {
                        // tslint:disable-next-line:max-line-length
                        throw new Error(`StudentRemark of studentID: '${StudentID}' in default quarter not found, consider query options 'quarterID' to get more specific information`);
                    }
                    return result[0].Remark;
                }),
            );
        }
    }

    private checkExist(
        StudentID: number,
        QuarterID: number,
    ): Observable<boolean> {
        return from(this.model.findOne({
            where: { StudentID, QuarterID },
        })).pipe(
            map((result) => result !== null),
        );
    }

    private checkExistWithDefaultQuarter(
        StudentID: number,
    ): Observable<boolean> {
        return Connection.getInstance().select<number>(
            `SELECT StudentRemark.ID
            FROM StudentRemark
                JOIN Quarter ON StudentRemark.QuarterID = Quarter.ID
            WHERE StudentID = :StudentID AND StartDate < GETDATE() AND EndDate > GETDATE() AND QuarterType = 'normal';`,
            { replacements: { StudentID } },
        ).pipe(
            map((result) => result.length !== 0),
        );
    }
}
