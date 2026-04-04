import { Module } from "@nestjs/common";
import { SubtitlingController } from "./controller/subtitling.controller";
import { SubtitlingService } from "./service/subtitling.service";
import { TranscriptionService } from "./service/transcription.service";
import { SubtitleMediaService } from "./service/subtitle-media.service";
import { BullModule } from "@nestjs/bullmq";
import { JobConsumerService } from "./service/job-consumer.service";

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
        })
    ],
    controllers: [SubtitlingController],
    providers: [
        SubtitlingService, TranscriptionService, 
        SubtitleMediaService, JobConsumerService
    ]
})
export class AppModule { }