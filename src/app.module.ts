import { Module } from "@nestjs/common";
import { SubtitlingController } from "./controller/upload.controller";
import { SubtitlingService } from "./service/subtitling.service";
import { TranscriptionService } from "./service/transcription.service";
import { SubtitleMediaService } from "./service/subtitle-media.service";

@Module({
    controllers: [SubtitlingController],
    providers: [SubtitlingService, TranscriptionService, SubtitleMediaService]
})
export class AppModule { }