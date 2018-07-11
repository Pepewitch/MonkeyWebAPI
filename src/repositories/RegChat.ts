import { from, Observable } from "rxjs";
import { flatMap } from "rxjs/operators";
import { map } from "../../node_modules/rxjs/operators";
import { Connection } from "../models/Connection";
import { Visibility as Type } from "../models/util/context";
import { IRegChatModel, RegChatInstance, regChatModel } from "../models/v1/regChat";
import { Quarter } from "./Quarter";
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
        StudentID: number,
        ChatMessage: string,
        SenderID: number,
        QuarterID?: number,
    ): Observable<IRegChatModel> {
        if (QuarterID) {
            return from(this.model.create({ StudentID, ChatMessage, QuarterID, SenderID, Visibility: Type.show }));
        } else {
            return Quarter.getInstance().defaultQuarter().pipe(
                flatMap((quarter) => {
                    return from(this.model.create({ StudentID, ChatMessage, QuarterID: quarter.ID, SenderID, Visibility: Type.show }));
                }),
            );
        }
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
        if (value.Visibility) {
            updateValue = { ...updateValue, Visibility: value.Visibility };
        }
        return from(this.model.update(updateValue, { where: { ID } }))
            .pipe(
                map((regChat) => regChat[0]),
        );
    }
}
