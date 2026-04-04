import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { SubtitleMediaService } from "./subtitle-media.service";
import { TranscriptionService } from "./transcription.service";

@Processor("video", { concurrency: 3 })
export class JobConsumerService extends WorkerHost {
    constructor(
        private subtitleMediaService: SubtitleMediaService,
        private transcriptionService: TranscriptionService
    ) {
        super()
    }

    async process({ data }: Job): Promise<any> {
        const audioPath = await this.subtitleMediaService.extractAudio(data.videoPath);
        const transcription = await this.transcriptionService.generate(audioPath, data);

        const outputPath = await this.subtitleMediaService.burnSubtitles(
            data.videoPath, transcription
        );

        return { outputPath }
    }
}