import { Module } from "@nestjs/common";
import { TranscodeService } from "../service/transcode.service";
import { VideoController } from "../controller/video.controller";
import { VideoService } from "../service/video.service";
import { RateLimitModule } from "./rate-limit.module";
import { WhisperService } from "src/service/whisper.service";

@Module({
    imports: [RateLimitModule],
    controllers: [VideoController],
    providers: [VideoService, TranscodeService, WhisperService]
})
export class AppModule { }