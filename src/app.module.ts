import { Module } from "@nestjs/common";
import { VideoController } from "./controller/video.controller";
import { VideoService } from "./service/video.service";
import { TranscodeService } from "./service/transcode.service";
import { BullModule } from "@nestjs/bullmq";
import { ConsumerService } from "./service/consumer.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { WebsocketService } from "./service/websocket.service";

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: "redis",
                port: 6379
            }
        }),
        BullModule.registerQueue({
            name: "video"
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public")
        })
    ],
    controllers: [VideoController],
    providers: [
        VideoService,
        TranscodeService,
        ConsumerService,
        WebsocketService
    ]
})

export class AppModule { }