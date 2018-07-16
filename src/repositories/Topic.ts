import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { ITopicModel, TopicInstance, topicModel } from "../models/v1/topic";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class Topic extends SequelizeModel<TopicInstance, ITopicModel> {

    public static getInstance(): Topic {
        if (!this.instance) {
            this.instance = new Topic();
        }
        return this.instance;
    }

    private static instance: Topic;

    private constructor() {
        super();
        this.model = topicModel(Connection.getInstance().getConnection());
    }

    public add(
        TopicSubj: string,
        Class: string,
        // tslint:disable-next-line:no-shadowed-variable
        Topic: string,
        TopicName: string,
    ): Observable<ITopicModel> {
        return from(this.model.create({ TopicSubj, Class, Topic, TopicName }));
    }

    public edit(
        ID: number,
        value: Partial<ITopicModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<ITopicModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }
}
