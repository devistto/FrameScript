import { Body, Controller, Delete, Get, Param, ParseFilePipe, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { multerOptions } from 'src/config/multer-options';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranscriptionDataDto } from 'src/dto/transcription-data.dto';
import { VideoService } from 'src/service/video.service';
import { FileLifeCycleInterceptor } from 'src/interceptor/file-life-cycle.interceptor';
import { FileLifeCycleService } from 'src/service/file-life-cycle.service';
import { createReadStream } from 'node:fs';
import { type Response } from 'express';

@Controller('videos')
export class VideoController {
    constructor(
        private readonly videoService: VideoService,
        private fileService: FileLifeCycleService
    ) { }

    @Post("subtitles")
    @UseInterceptors(FileInterceptor('video', multerOptions), FileLifeCycleInterceptor)
    async generate(
        @UploadedFile(new ParseFilePipe({
            fileIsRequired: true
        })) file: Express.Multer.File,
        @Body() dto: TranscriptionDataDto
    ) {
        const jobId = await this.videoService.enqueue(file.path, dto);
        return { jobId, status: "queued" };
    }

    @Delete('jobs/:id')
    async cancel(@Param('id') id: string) {
        await this.videoService.cancel(id);
    }

    @Get('jobs/:id')
    async findComplete(
        @Param('id') id: string
    ) {
        const result = await this.videoService.findComplete(id);

        if (typeof result === "string") return { result };

        const stream = createReadStream(result.output);

        stream.on('end', async () => {
            await this.fileService.cleanup(result.id!);
        });

        return new StreamableFile(stream, {
            type: 'video/mp4',
            disposition: `attachment; filename="output.mp4"`,
        });
    }
}