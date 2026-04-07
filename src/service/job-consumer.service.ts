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

    async process(job: Job): Promise<any> {
        const audioPath = await this.subtitleMediaService.extractAudio(job.data.videoPath);

        const transcription = await this.transcriptionService.generate(audioPath, job.data);
        
        const outputPath = await this.subtitleMediaService.burnSubtitles(
            job.data.videoPath, transcription
        );

        return { outputPath }
    }
}