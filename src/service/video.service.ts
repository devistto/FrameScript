import { BadRequestException, Injectable, NotAcceptableException } from "@nestjs/common";
import { TranscriptionDataDto } from "src/dto/transcription-data.dto";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";
import { FileLifeCycleService } from "./file-life-cycle.service";

@Injectable()
export class VideoService {
    constructor(
        @InjectQueue("video") private videoQueue: Queue,
        private fileService: FileLifeCycleService
    ) { }

    async enqueue(videoPath: string, dto: TranscriptionDataDto) {
        const job = await this.videoQueue.add("transcode", { ...dto, videoPath }, {
            attempts: 3,
            removeOnFail: true,
            removeOnComplete: {
                age: 10
            }
        })

        this.fileService.register(job.id!, job.data.videoPath)
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

        if (!job) throw new BadRequestException("Job process was not found.")

        const status = await job.getState()

        if (status !== "completed") return status;

        return {
            id: job?.id,
            output: job?.returnvalue.outputPath
        }
    }
}