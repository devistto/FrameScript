import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { SubtitleMediaService } from "./subtitle-media.service";
import { TranscriptionService } from "./transcription.service";
import { SocketEventService } from "./socket-event.service";

@Processor("video", { concurrency: 3 })
export class JobConsumerService extends WorkerHost {
    constructor(
        @InjectQueue("video") private videoQueue: Queue,
        private subtitleMediaService: SubtitleMediaService,
        private transcriptionService: TranscriptionService,
        private socketEventService: SocketEventService,

    ) {
        super()
    }

    async process(job: Job): Promise<void> {
        await job.updateProgress(0)
        const audioPath = await this.subtitleMediaService.extractAudio(job.data.videoPath);

        await job.updateProgress(10)
        const textContent = await this.transcriptionService.generate(audioPath, job.data);

        const activeJob = await this.videoQueue.getJob(job.id!)

        if (activeJob?.data?.cancelled) return;

        await job.updateProgress(50)
        await this.subtitleMediaService.burnSubtitles(
            job.data.videoPath, textContent
        );

        await job.updateProgress(100)
    }

    @OnWorkerEvent('progress')
    async updateProgress(job: Job) {
        const activeJob = await this.videoQueue.getJob(job.id!);

        if (!activeJob?.data?.cancelled) {
            this.socketEventService.sendUpdate({
                id: Number(job.id),
                progress: job.progress
            })
        }
    }
}