import { from, Observable } from "../../node_modules/rxjs";
import { Connection } from "../models/Connection";
import { ClassInstance, classModel, ClassType as Type, IClassModel } from "../models/v1/class";
import { SequelizeModel } from "./SequelizeModel";

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
}
