// import { Connection } from "../models/Connection";
// import { SequelizeModel } from "./SequelizeModel";

// export class ClassTemplate extends SequelizeModel<TemplateInstance, ITemplateModel> {

//     public static getInstance(): ClassTemplate {
//         if (!this.instance) {
//             this.instance = new ClassTemplate();
//         }
//         return this.instance;
//     }

//     private static instance: ClassTemplate;

//     private constructor() {
//         super();
//         this.model = templateModel(Connection.getInstance().getConnection());
//     }
// }
