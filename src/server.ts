import { createServer } from "http";
import WebSocket from "ws";
import app from "./app";
import { SocketGenerator } from "./socket";
import logger from "./util/logger";

export const server = createServer(app);

server.listen(app.get("port"), () => {
    logger.info(`  App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
    logger.info("  Press CTRL-C to stop\n");
});

SocketGenerator.getInstance().setServer(server);

// Test Web socket service
const webSocketServer = SocketGenerator.getInstance().getVerifySocket();

webSocketServer.on("connection", (socket: WebSocket) => {
    socket.send(JSON.stringify({ msg: "Hello" }));
});
