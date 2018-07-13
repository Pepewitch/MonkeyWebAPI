import _ from "lodash";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ClassInstance, classModel, ClassType as Type, IClassModel } from "../models/v1/class";
import { ClassCard } from "../types/ClassCard";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

interface ISubmissionQuery {
    ID: number;
    ClassName: string;
    ClassTimes: number;
    SubmissionState: string;
    SubmissionTimes: number;
    ClassSubject: string;
    ClassDate: Date;
    RoomName: string;
    StudentCount: number;
}

interface IInfoQuery {
    ClassName: string;
    NicknameEn: string;
    TutorID: number;
    ClassDate: Date;
    ClassDescription: string;
    StudentID: number;
    Firstname: string;
    Nickname: string;
    Grade: number;
}

interface IInfoResult {
    className: string;
    tutor: string;
    tutorID: number;
    date: Date;
    description: string;
    students: Array<{
        studentID: number;
        firstname: string;
        nickname: string;
        grade: number;
    }>;
}

export class Class extends SequelizeModel<ClassInstance, IClassModel> {

    public static getInstance(): Class {
        if (!this.instance) {
            this.instance = new Class();
        }
        return this.instance;
    }

    private static instance: Class;

    private constructor() {
        super();
        this.model = classModel(Connection.getInstance().getConnection());
    }

    public add(
        ClassName: string,
        QuarterID: number,
        ClassDate: Date,
        ClassSubject: string,
        TutorID: number,
        ClassType: Type,
    ): Observable<IClassModel> {
        return from(this.model.create({
            ClassDate,
            ClassName,
            ClassSubject,
            ClassType,
            QuarterID,
            TutorID,
        }));
    }

    public addWithoutTutor(
        ClassName: string,
        QuarterID: number,
        ClassDate: Date,
        ClassSubject: string,
        ClassType: Type,
    ): Observable<IClassModel> {
        return from(this.model.create({
            ClassDate,
            ClassName,
            ClassSubject,
            ClassType,
            QuarterID,
        }));
    }

    public list(
        ClassType?: Type,
        QuarterID?: number,
    ): Observable<IClassModel[]> {
        if (QuarterID) {
            if (ClassType) {
                return from(this.model.findAll({ where: { ClassType, QuarterID } }));
            } else {
                return from(this.model.findAll({ where: { QuarterID } }));
            }
        } else {
            if (ClassType) {
                return Connection.getInstance().select<IClassModel>(
                    `SELECT *
                    FROM Class
                        JOIN Quarter ON Class.QuarterID = Quarter.ID
                    WHERE Quarter.StartDate < NOW() AND Quarter.EndDate > NOW() AND Class.ClassType = :ClassType`, {
                        replacements: { ClassType },
                    },
                );
            } else {
                return Connection.getInstance().select<IClassModel>(
                    `SELECT *
                    FROM Class
                        JOIN Quarter ON Class.QuarterID = Quarter.ID
                    WHERE Quarter.StartDate < NOW() AND Quarter.EndDate > NOW()`,
                );
            }
        }
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }

    public edit(
        ID: number,
        value: Partial<IClassModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<IClassModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }

    public getSubmission(
        TutorID: number,
    ): Observable<ClassCard[]> {
        return Connection.getInstance().select<ISubmissionQuery>(
            `SELECT
                Class.ID,
                Class.ClassName,
                Class.ClassTimes,
                Submission.SubmissionState,
                Submission.SubmissionTimes,
                Class.ClassSubject,
                Class.ClassDate,
                Room.RoomName,
                (SELECT
                        COUNT(*)
                    FROM
                        Class
                            JOIN
                        ClassReg ON Class.ID = ClassReg.ClassID
                            AND (ClassReg.RegStatus = 'selected'
                            OR ClassReg.RegStatus = 'registered')) AS StudentCount
            FROM
                Class
                    JOIN
                Quarter ON Class.QuarterID = Quarter.ID
                    LEFT JOIN
                Submission ON Class.ID = Submission.ClassID
                    LEFT JOIN
                Room ON Class.RoomID = Room.ID
            WHERE
                Quarter.StartDate < NOW()
                    AND Quarter.EndDate > NOW()
                    AND Class.TutorID = :TutorID`, {
                replacements: { TutorID: 99023 },
            },
        ).pipe(
            map((classes) => {
                // TODO: Fill submission array
                const groupedClasses: ClassCard[] = [];
                for (const classDetail of classes) {
                    const index = _.findIndex(groupedClasses, (o) => o.ID === classDetail.ID);
                    if (index !== -1) {
                        groupedClasses[index].addSubmission({ status: classDetail.SubmissionState, count: classDetail.SubmissionTimes });
                    } else {
                        const submission: Array<{ status: string, count: number }> = [];
                        if (classDetail.SubmissionState !== null && classDetail.SubmissionTimes !== null) {
                            submission.push({ status: classDetail.SubmissionState, count: classDetail.SubmissionTimes });
                        }
                        groupedClasses.push(new ClassCard(
                            classDetail.ID,
                            classDetail.ClassName,
                            classDetail.ClassTimes,
                            submission,
                            classDetail.ClassSubject,
                            classDetail.ClassDate,
                            classDetail.StudentCount,
                            classDetail.RoomName,
                        ));
                    }
                }
                return groupedClasses;
            }),
        );
    }

    public info(
        ClassID: number,
    ): Observable<IInfoResult | null> {
        return Connection.getInstance().select<IInfoQuery>(
            `SELECT
                Class.ClassName,
                Tutor.NicknameEn,
                Tutor.ID AS TutorID,
                Class.ClassDate,
                Class.ClassDescription,
                Student.ID AS StudentID,
                Student.Firstname,
                Student.Nickname,
                StudentState.Grade
            FROM
                ClassReg
                    LEFT JOIN
                Class ON ClassReg.ClassID = Class.ID
                    LEFT JOIN
                Users AS Tutor ON Class.TutorID = Tutor.ID
                    LEFT JOIN
                Users AS Student ON ClassReg.StudentID = Student.ID
                    LEFT JOIN
                StudentState ON StudentState.ID = (SELECT
                        StudentState.ID
                    FROM
                        StudentState
                    WHERE
                        StudentState.StudentID = Student.ID
                    ORDER BY StudentState.createdAt DESC
                    LIMIT 1)
            WHERE
                ClassReg.ClassID = :ClassID
                    AND (ClassReg.RegStatus = 'selected'
                    OR ClassReg.RegStatus = 'registered')
                    AND (StudentState.Stage = 'pending'
                    OR StudentState.Stage = 'approved'
                    OR StudentState.Stage = 'finished')
            UNION SELECT
                Class.ClassName,
                Tutor.NicknameEn,
                Tutor.ID AS TutorID,
                Class.ClassDate,
                Class.ClassDescription,
                NULL,
                NULL,
                NULL,
                NULL
            FROM
                Class
                    LEFT JOIN
                Users AS Tutor ON Class.TutorID = Tutor.ID
            WHERE
                Class.ID = :ClassID`, {
                replacements: { ClassID },
            },
        ).pipe(
            map((result) => {
                if (result.length === 0) {
                    return null;
                } else {
                    const response: IInfoResult = {
                        className: result[0].ClassName,
                        date: result[0].ClassDate,
                        description: result[0].ClassDescription,
                        students: [],
                        tutor: result[0].NicknameEn,
                        tutorID: result[0].TutorID,
                    };
                    for (const student of result) {
                        if (student.StudentID !== null) {
                            response.students.push({
                                firstname: student.Firstname,
                                grade: student.Grade,
                                nickname: student.Nickname,
                                studentID: student.StudentID,
                            });
                        }
                    }
                    return response;
                }
            }),
        );
    }
}
