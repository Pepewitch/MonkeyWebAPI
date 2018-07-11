import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { Visibility as Type } from "../models/util/context";
import { ISubmissionChatModel, SubmissionChatInstance, submissionChatModel } from "../models/v1/submissionChat";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class SubmissionChat extends SequelizeModel<SubmissionChatInstance, ISubmissionChatModel> {

    public static getInstance(): SubmissionChat {
        if (!this.instance) {
            this.instance = new SubmissionChat();
        }
        return this.instance;
    }

    private static instance: SubmissionChat;

    private constructor() {
        super();
        this.model = submissionChatModel(Connection.getInstance().getConnection());
    }

    public add(
        SubmissionID: number,
        ChatMessage: string,
        SenderID: number,
    ): Observable<ISubmissionChatModel> {
        return from(this.model.create({ SubmissionID, ChatMessage, SenderID, Visibility: Type.show }));
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }

    public edit(
        ID: number,
        value: Partial<ISubmissionChatModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<ISubmissionChatModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }
    // form: string,
    // fromID: number,
    // message: string,
    // timestamp: Date,

    public list(
        ID: number,
    ): Observable<Array<{
        from: string,
        fromID: number,
        message: string,
        timestamp: Date,
    }>> {
        return Connection.getInstance().select<{
            SenderID: number,
            createdAt: Date,
            ChatMessage: string,
            NicknameEn: string,
        }>(
            `SELECT
                SubmissionChat.SenderID,
                SubmissionChat.createdAt,
                SubmissionChat.ChatMessage,
                Users.NicknameEn
            FROM
                SubmissionChat
                    JOIN
                Users ON SubmissionChat.SenderID = Users.ID
            WHERE
                SubmissionChat.SubmissionID = :ID`, {
                replacements: { ID },
            },
        ).pipe(
            map((result) => {
                return result.map((o) => {
                    return {
                        from: o.NicknameEn,
                        fromID: o.SenderID,
                        message: o.ChatMessage,
                        timestamp: o.createdAt,
                    };
                });
            }),
        );
    }
}
