import { Injectable } from "@nestjs/common";
import { TranscriptionDataDto } from "src/dto/transcription-data.dto";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";

@Injectable()
export class VideoService {
    constructor(@InjectQueue("video") private videoQueue: Queue) { }

    async enqueue(videoPath: string, dto: TranscriptionDataDto) {
        const job = await this.videoQueue.add("transcode", { ...dto, videoPath }, {
            attempts: 3,
            removeOnFail: true,
            removeOnComplete: {
                age: 10
            }
        })

        return job.id
    }

    async cancel(id: string) {
        const job = await this.videoQueue.getJob(id);

        if (job) {
            const state = await job.getState();

            if (state !== "active") {
                await job.remove();
                return;
            }

            await job.updateData({
                ...job.data,
                cancelled: true
            });
        };
    }

    async findComplete(id: string) {
        const job = await this.videoQueue.getJob(id);
        return job?.returnvalue.outputPath;
    }
}