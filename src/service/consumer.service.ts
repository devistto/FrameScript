import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { TranscodeService } from "./transcode.service";
import { WebsocketService } from "./websocket.service";
import createTranscription from "src/config/transcription";

@Processor("video", { concurrency: 3 })
export class ConsumerService extends WorkerHost {
    constructor(
        @InjectQueue("video") private videoQueue: Queue,
        private transcode: TranscodeService,
        private websocket: WebsocketService
    ) {
        super()
    }

    async process(job: Job): Promise<any> {
        await job.updateProgress(0)
        const audioPath = await this.transcode.extractAudio(job.data.videoPath);

        await job.updateProgress(10)
        const textContent = await createTranscription(audioPath, job.data);

        const activeJob = await this.videoQueue.getJob(job.id!)

        if (activeJob?.data?.cancelled) return;

        await job.updateProgress(50)
        const outputPath = await this.transcode.burnSubtitles(
            job.data.videoPath, textContent
        );

        await job.updateProgress(100)
        return { outputPath }
    }

    @OnWorkerEvent('progress')
    async progress(job: Job) {
        this.websocket.progress({
            id: job.id!,
            progress: job.progress
        })
    }
}