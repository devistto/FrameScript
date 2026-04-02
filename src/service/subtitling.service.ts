import { Injectable } from "@nestjs/common";
import { SubtitleMediaService } from "./subtitle-media.service";
import { TranscriptionService } from "src/service/transcription.service";
import { TranscriptionDataDto } from "src/dto/transcription-data.dto";

@Injectable()
export class SubtitlingService {
    constructor(
        private readonly subtitleMediaService: SubtitleMediaService,
        private readonly transcriptionService: TranscriptionService
    ) { }

    async generate(videoPath: string, dto: TranscriptionDataDto) {
        const audioPath = await this.subtitleMediaService.extractAudio(videoPath);
        const subtitles = await this.transcriptionService.generate(audioPath, dto);
        return await this.subtitleMediaService.burnSubtitles(videoPath, subtitles);
    }
}