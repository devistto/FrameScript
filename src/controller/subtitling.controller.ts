import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { multerOptions } from 'src/utils/multer-options';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranscriptionDataDto } from 'src/dto/transcription-data.dto';
import { SubtitlingService } from 'src/service/subtitling.service';

@Controller('videos')
export class SubtitlingController {
    constructor(private readonly SubtitlingService: SubtitlingService) { }

    @Post("subtitles")
    @UseInterceptors(FileInterceptor('video', multerOptions))
    async generate(@UploadedFile() file: Express.Multer.File, @Body() dto: TranscriptionDataDto) {
        const jobId = await this.SubtitlingService.enqueue(file.path, dto);
        return { jobId, status: "queued" };
    }
}