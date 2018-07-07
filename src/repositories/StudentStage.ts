import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { IStudentStateModel, StudentStageList, StudentStateInstance, studentStateModel } from "../models/v1/studentState";
import { SequelizeModel } from "./SequelizeModel";

export class StudentStage extends SequelizeModel<StudentStateInstance, IStudentStateModel> {

    public static getInstance(): StudentStage {
        if (!this.instance) {
            this.instance = new StudentStage();
        }
        return this.instance;
    }

    private static instance: StudentStage;

    private constructor() {
        super();
        this.model = studentStateModel(Connection.getInstance().getConnection());
    }

    public add(
        QuarterID: number,
        StudentID: number,
        Stage: StudentStageList,
        Grade?: number,
    ): Observable<IStudentStateModel> {
        if (Grade) {
            return from(this.model.create({ Grade, QuarterID, StudentID, Stage }));
        } else {
            return this.grade(StudentID, QuarterID).pipe(
                flatMap((grade) => from(this.model.create({ Grade: grade, QuarterID, StudentID, Stage }))),
            );
        }
    }

    public get(
        StudentID: number,
        QuarterID?: number,
    ): Observable<IStudentStateModel> {
        if (QuarterID) {
            return this.getLatestStudentModelInQuarter(StudentID, QuarterID);
        } else {
            return this.getLatestStudentModelInDefaultQuarter("*", StudentID);
        }
    }

    public grade(
        StudentID: number,
        QuarterID?: number,
    ): Observable<number> {
        if (QuarterID) {
            return this.getLatestStudentModelInQuarter(StudentID, QuarterID).pipe(
                map((student) => student.Grade),
            );
        } else {
            return this.getLatestStudentModelInDefaultQuarter("Grade", StudentID).pipe(
                map((student) => student.Grade),
            );
        }
    }

    private getLatestStudentModelInQuarter(StudentID: number, QuarterID: number): Observable<IStudentStateModel> {
        return from(this.model.findOne<IStudentStateModel>({
            order: [
                ["createdAt", "DESC"],
            ],
            where: { StudentID, QuarterID },
        })).pipe(
            map((student) => {
                if (!student) {
                    throw new Error(`StudentState of studentID: '${StudentID}' in quarterID: '${QuarterID}' not found`);
                }
                return student;
            }),
        );
    }

    private getLatestStudentModelInDefaultQuarter(selectStatement: string, StudentID: number): Observable<IStudentStateModel> {
        return Connection.getInstance().select<IStudentStateModel>(
            `SELECT TOP(1) ${selectStatement}
            FROM StudentState
                JOIN Quarter ON QuarterID = Quarter.ID
            WHERE StudentID = :StudentID AND StartDate < GETDATE() AND EndDate > GETDATE() AND QuarterType = 'normal';`, {
                replacements: { StudentID },
            },
        ).pipe(
            map((result) => {
                if (result.length === 0) {
                    // tslint:disable-next-line:max-line-length
                    throw new Error(`StudentState of studentID: '${StudentID}' in default quarter not found, consider query options 'quarterID' to get more specific information`);
                }
                return result[0];
            }),
        );
    }
}
