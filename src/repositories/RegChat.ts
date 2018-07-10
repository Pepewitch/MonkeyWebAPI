import { from, Observable } from "rxjs";
import { map } from "../../node_modules/rxjs/operators";
import { Connection } from "../models/Connection";
import { Visibility as Type} from "../models/util/context";
import { IRegChatModel, RegChatInstance, regChatModel } from "../models/v1/regChat";
import { SequelizeModel } from "./SequelizeModel";

export class RegChat extends SequelizeModel<RegChatInstance, IRegChatModel> {

    public static getInstance(): RegChat {
        if (!this.instance) {
            this.instance = new RegChat();
        }
        return this.instance;
    }

    private static instance: RegChat;

    private constructor() {
        super();
        this.model = regChatModel(Connection.getInstance().getConnection());
    }

    public add(
        ID: number,
        StudentID: number,
        ChatMessage: string,
        QuarterID: number,
        SenderID: number,
        Visibility: Type,
    ): Observable<IRegChatModel> {
        return from(this.model.create({ ID, StudentID, ChatMessage, QuarterID, SenderID, Visibility }));
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }

    public edit(
        ID: number,
        value: Partial<IRegChatModel>,
    ): Observable<number> {
        let updateValue = {} as Partial<IRegChatModel>;
        if (value.ChatMessage) {
            updateValue = { ...updateValue, ChatMessage: value.ChatMessage };
        }
        return from(this.model.update(updateValue, { where: { ID } }))
            .pipe(
                map((regChat) => regChat[0]),
        );
    }
}
