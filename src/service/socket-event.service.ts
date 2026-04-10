import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { JobProgress } from "bullmq";
import { Server } from "socket.io";

type JobUpdateData = {
    id: number;
    progress: JobProgress;
}

@WebSocketGateway()
export class SocketEventService {
    @WebSocketServer()
    io!: Server

    sendUpdate(data: JobUpdateData) {
        this.io.emit("update", (data))
    }
}