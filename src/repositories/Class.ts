import _ from "lodash";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ClassInstance, classModel, ClassType as Type, IClassModel } from "../models/v1/class";
import { SubmissionState } from "../models/v1/submission";
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

interface ISubmissionResult {
    ID: number;
    title: string;
    maxSubmission: number;
    submissions: Array<{ status: string, count: number }>;
    subject: string;
    date: Date;
    student: number;
    room: string;
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

interface IListQuery {
    ID: number;
    ClassName: string;
    TutorID: number;
    ClassDate: Date;
    NicknameEn: string;
    RoomName: string;
    MaxSeat: number;
    ClassSubject: string;
    ClassType: Type;
    StudentCount: number;
    Grade: string;
}

interface IListResult {
    ID: number;
    name: string;
    tutor: string;
    date: Date;
    room: string;
    student: number;
    maxStudent: number;
    subject: string;
    type: Type;
    tutorID: number;
    grade: string;
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
        ClassType: Type,
        Price?: number,
        TutorID?: number,
    ): Observable<IClassModel> {
        let addObject: IClassModel = {
            ClassDate, ClassName, ClassSubject, ClassType, QuarterID,
        };
        if (TutorID) {
            addObject = { ...addObject, TutorID };
        }
        if (Price) {
            addObject = { ...addObject, Price };
        }
        return from(this.model.create(addObject));
    }

    public list(
        ClassType?: Type,
        QuarterID?: number,
    ): Observable<IListResult[]> {
        let replacements: any;
        let statement =
            `SELECT
            Class.ID,
            Class.ClassName,
            Class.TutorID,
            Class.ClassDate,
            Users.NicknameEn,
            Room.RoomName,
            Room.MaxSeat,
            Class.ClassSubject,
            Class.ClassType,
            Class.Grade,
            (SELECT
                    COUNT(id)
                FROM
                    ClassReg
                WHERE
                    ClassReg.ClassID = Class.ID
                        AND (ClassReg.RegStatus = 'selected'
                        OR ClassReg.RegStatus = 'registered')) AS StudentCount
        FROM
            Class
                LEFT JOIN
            Users ON Class.TutorID = Users.ID
                LEFT JOIN
            Room ON Class.RoomID = Room.ID `;
        if (QuarterID) {
            if (ClassType) {
                statement += `WHERE Class.QuarterID = :QuarterID AND Class.ClassType = :ClassType`;
                replacements = { QuarterID, ClassType };
            } else {
                statement += `WHERE Class.QuarterID = :QuarterID`;
                replacements = { QuarterID };
            }
        } else {
            if (ClassType) {
                statement += `WHERE Class.ClassType = :ClassType`;
                replacements = { ClassType };
            } else {
                statement +=
                    `LEFT JOIN Quarter ON Class.QuarterID = Quarter.ID
                WHERE
                    Quarter.StartDate <= DATE(NOW())
                        AND Quarter.EndDate >= DATE(NOW())
                        AND Quarter.QuarterType = 'normal'`;
                replacements = {};
            }
        }
        return Connection.getInstance().select<IListQuery>(statement, { replacements })
            .pipe(
                map((results) => results.map((result) => {
                    const resultObject = {
                        ID: result.ID,
                        date: result.ClassDate,
                        maxStudent: result.MaxSeat,
                        name: result.ClassName,
                        room: result.RoomName,
                        student: result.StudentCount,
                        subject: result.ClassSubject,
                        tutor: result.NicknameEn,
                        tutorID: result.TutorID,
                        type: result.ClassType,
                    };
                    if (result.ClassType === Type.course) {
                        return { ...resultObject, grade: result.Grade || "" };
                    } else {
                        return { ...resultObject, grade: result.Grade || "3,4,5,6,7,8,9,10,11,12" };
                    }
                })),
        );
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
    ): Observable<ISubmissionResult[]> {
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
                replacements: { TutorID },
            },
        ).pipe(
            map((classes) => {
                const groupedClasses: ISubmissionResult[] = [];
                for (const classDetail of classes) {
                    const index = _.findIndex(groupedClasses, (o) => o.ID === classDetail.ID);
                    if (index !== -1) {
                        groupedClasses[index].submissions.push({ status: classDetail.SubmissionState, count: classDetail.SubmissionTimes });
                    } else {
                        const submission: Array<{ status: string, count: number }> = [];
                        if (classDetail.SubmissionState !== null && classDetail.SubmissionTimes !== null) {
                            submission.push({ status: classDetail.SubmissionState, count: classDetail.SubmissionTimes });
                        }
                        groupedClasses.push({
                            ID: classDetail.ID,
                            date: classDetail.ClassDate,
                            maxSubmission: classDetail.ClassTimes,
                            room: classDetail.RoomName,
                            student: classDetail.StudentCount,
                            subject: classDetail.ClassSubject,
                            submissions: submission,
                            title: classDetail.ClassName,
                        });
                    }
                }
                for (const eachClass of groupedClasses) {
                    if (eachClass.maxSubmission !== null) {
                        for (let i = 0; i < eachClass.maxSubmission; i++) {
                            if (_.findIndex(eachClass.submissions, (o) => o.count === i + 1) === -1) {
                                eachClass.submissions.push({
                                    count: i + 1,
                                    status: SubmissionState.empty,
                                });
                            }
                        }
                        eachClass.submissions.sort((a, b) => a.count - b.count);
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
