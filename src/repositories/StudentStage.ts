import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import Sequelize from "sequelize";
import { Connection } from "../models/Connection";
import { IStudentStateModel, StudentStageList, StudentStateInstance, studentStateModel } from "../models/v1/studentState";

export class StudentStage {

    public static getInstance(): StudentStage {
        if (!this.instance) {
            this.instance = new StudentStage();
        }
        return this.instance;
    }

    private static instance: StudentStage;

    private studentStateModel: Sequelize.Model<StudentStateInstance, IStudentStateModel>;

    private constructor() {
        this.studentStateModel = studentStateModel(Connection.getInstance().getConnection());
    }

    public add(
        QuarterID: number,
        StudentID: number,
        Stage: StudentStageList,
        Grade?: number,
    ): Observable<IStudentStateModel> {
        if (Grade) {
            return from(this.studentStateModel.create({ Grade, QuarterID, StudentID, Stage }));
        } else {
            return this.grade(StudentID, QuarterID).pipe(
                flatMap((grade) => from(this.studentStateModel.create({ Grade: grade, QuarterID, StudentID, Stage }))),
            );
        }
    }

    public grade(
        StudentID: number,
        QuarterID?: number,
    ): Observable<number> {
        if (QuarterID) {
            return from(this.studentStateModel.findOne<IStudentStateModel>({
                order: [
                    ["createdAt", "DESC"],
                ],
                where: { StudentID, QuarterID },
            })).pipe(
                map((student) => {
                    if (!student) {
                        throw new Error(`Grade of studentID: '${StudentID}' in quarterID: '${QuarterID}' not found`);
                    }
                    return student.Grade;
                }),
            );
        } else {
            return Connection.getInstance().select<number>(
                `SELECT Grade
                FROM StudentState
                    JOIN Quarter ON QuarterID = Quarter.ID
                WHERE StudentID = :StudentID AND StartDate < GETDATE() AND EndDate > GETDATE() AND QuarterType = 'normal';`, {
                    replacements: { StudentID },
                },
            ).pipe(
                map((result) => {
                    if (result.length === 0) {
                        // tslint:disable-next-line:max-line-length
                        throw new Error(`Grade of studentID: '${StudentID}' in default quarter not found, specify quarterID to get more specific information`);
                    }
                    return result[0];
                }),
            );
        }
    }
}
