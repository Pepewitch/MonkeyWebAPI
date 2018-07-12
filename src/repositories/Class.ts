import _ from "lodash";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ClassInstance, classModel, ClassType as Type, IClassModel } from "../models/v1/class";
import { ClassCard } from "../types/ClassCard";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

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
        return Connection.getInstance().select<{
            ID: number,
            ClassName: string,
            ClassTimes: number,
            SubmissionState: string,
            SubmissionTimes: number,
            ClassSubject: string,
            ClassDate: Date,
            RoomName: string,
            StudentCount: number,
        }>(
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
}
