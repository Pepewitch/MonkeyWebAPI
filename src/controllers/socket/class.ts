import WebSocket, { Server } from "ws";
import { SocketGenerator } from "../../socket";
import { ClassCard } from "../../types/ClassCard";
import { ClassSocketResult } from "../../types/ClassSocketResult";

export class ClassSocket {

    public static getInstance(): ClassSocket {
        if (!this.instance) {
            this.instance = new ClassSocket();
        }
        return this.instance;
    }

    private static instance: ClassSocket;

    private webSocketServer: Server;

    private constructor() {
        this.webSocketServer = SocketGenerator.getInstance().getVerifySocketWithPath("/class");
    }

    public init() {
        const card = new ClassCard(
            123,
            "Hello World",
            12,
            [{
                count: 2,
                status: "Accepted",
            }],
            "M",
            new Date(),
            21,
            "4",
        );

        const result = new ClassSocketResult("server", [
            card, card, card, card,
        ], null);

        this.webSocketServer.on("connection", (socket: WebSocket) => {
            socket.on("message", (query: ClassSocketResult) => {
                console.log(query);
                socket.send(`${result}`);
            });
        });
    }

}
