import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { SubtitleMediaService } from "./subtitle-media.service";
import { TranscriptionService } from "./transcription.service";
import { SocketEventService } from "./socket-event.service";

@Processor("video", { concurrency: 3 })
export class JobConsumerService extends WorkerHost {
    constructor(
        private subtitleMediaService: SubtitleMediaService,
        private transcriptionService: TranscriptionService,
        private socketEventService: SocketEventService
    ) {
        super()
    }

    async process(job: Job): Promise<void> {
        const audioPath = await this.subtitleMediaService.extractAudio(job.data.videoPath);

        await job.updateProgress(10)
        const textContent = await this.transcriptionService.generate(audioPath, job.data);

        await job.updateProgress(50)
        await this.subtitleMediaService.burnSubtitles(
            job.data.videoPath, textContent
        );

        await job.updateProgress(100)
    }

    @OnWorkerEvent('progress')
    updateProgress(job: Job) {
        this.socketEventService.sendUpdate({
            id: Number(job.id),
            progress: job.progress
        })
    }
}