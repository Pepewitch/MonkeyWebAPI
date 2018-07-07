import { Connection } from "../models/Connection";
import { IStudentInfoModel, StudentInfoInstance, studentInfoModel } from "../models/v1/studentInfo";
import { SequelizeModel } from "./SequelizeModel";

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
}
