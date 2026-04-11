import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { JobProgress } from "bullmq";
import { Server } from "socket.io";

type JobUpdateData = {
    id: string; 
    progress: JobProgress
}

@WebSocketGateway()
export class WebsocketService {
    @WebSocketServer()
    private io!: Server

    progress(data: JobUpdateData) {
        this.io.emit("progress", (data))
    }
}