import { Body, Controller, Delete, Get, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { multerOptions } from 'src/config/multer-options';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranscriptionDataDto } from 'src/dto/transcription-data.dto';
import { VideoService } from 'src/service/video.service';
import { createReadStream } from 'node:fs';

@Controller('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Post("subtitles")
    @UseInterceptors(FileInterceptor('video', multerOptions))
    async generate(@UploadedFile() file: Express.Multer.File, @Body() dto: TranscriptionDataDto) {
        const jobId = await this.videoService.enqueue(file.path, dto);
        return { jobId, status: "queued" };
    }

    @Delete('jobs/:id')
    async cancel(@Param('id') id: string) {
        await this.videoService.cancel(id);
    }

    @Get('jobs/:id')
    async findComplete(@Param('id') id: string): Promise<StreamableFile> {
        const finalVideoPath = await this.videoService.findComplete(id);
        
        return new StreamableFile(
            createReadStream(finalVideoPath),
            {
                type: 'video/mp4',
                disposition: `attachment; filename="output.mp4"`,
            });
    }
}