import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../models/Connection";
import { IRoomModel, RoomInstance, roomModel } from "../models/v1/room";
import { SequelizeModel } from "./SequelizeModel";
import { partialOf } from "./util/ObjectMapper";

export class Room extends SequelizeModel<RoomInstance, IRoomModel> {

    public static getInstance(): Room {
        if (!this.instance) {
            this.instance = new Room();
        }
        return this.instance;
    }

    private static instance: Room;

    private constructor() {
        super();
        this.model = roomModel(Connection.getInstance().getConnection());
    }

    public add(
        RoomName: string,
        QuarterID: number,
        MaxSeat: number,
    ): Observable<IRoomModel> {
        return from(this.model.create({ RoomName, MaxSeat, QuarterID }));
    }

    public list(
        QuarterID?: number,
    ): Observable<IRoomModel[]> {
        if (QuarterID) {
            return from(this.model.findAll<IRoomModel>({ where: { QuarterID }, raw: true }));
        } else {
            return Connection.getInstance().select<IRoomModel>(
                `SELECT *
                FROM Room
                    JOIN Quarter ON Room.QuarterID = Quarter.ID
                WHERE Quarter.StartDate < NOW() AND Quarter.EndDate > NOW();`,
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
        value: Partial<IRoomModel>,
    ): Observable<number> {
        return from(this.model.update(partialOf<IRoomModel>(value), { where: { ID } }))
            .pipe(
                map((result) => result[0]),
        );
    }
}
