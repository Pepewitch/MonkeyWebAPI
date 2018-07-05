// import { Connection } from "../models/Connection";
// import { SequelizeModel } from "./SequelizeRepo";

// export class ClassTemplate extends SequelizeModel<TemplateInstance, ITemplateModel> {

//     public static getInstance(): ClassTemplate {
//         if (!this.instance) {
//             this.instance = new ClassTemplate();
//         }
//         return this.instance;
//     }

//     private static instance: ClassTemplate;

//     private constructor() {
//         this.model = templateModel(Connection.getInstance().getConnection());
//     }
// }
