import { from, Observable } from "../../node_modules/rxjs";
import { Connection } from "../models/Connection";
import { IRoomModel, RoomInstance, roomModel } from "../models/v1/room";
import { SequelizeModel } from "./SequelizeModel";

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
                WHERE Quarter.StartDate < GETDATE() AND Quarter.EndDate > GETDATE();`,
            );
        }
    }

    public delete(
        ID: number,
    ): Observable<number> {
        return from(this.model.destroy({ where: { ID } }));
    }
}
