import { Body, Controller, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { multerOptions } from 'src/utils/multer-options';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { CleanUpInterceptor } from 'src/interceptor/clean-up.interceptor';
import { TranscriptionDataDto } from 'src/dto/transcription-data.dto';
import { SubtitlingService } from 'src/service/subtitling.service';

@Controller('videos')
export class SubtitlingController {
    constructor(private readonly SubtitlingService: SubtitlingService) { }

    @Post("subtitles")
    @UseInterceptors(FileInterceptor('video', multerOptions), CleanUpInterceptor)
    async generate(@UploadedFile() file: Express.Multer.File, @Body() dto: TranscriptionDataDto) {
        const finalVideoPath = await this.SubtitlingService.generate(file.path, dto);

        return new StreamableFile(
            createReadStream(finalVideoPath),
            {
                type: 'video/mp4',
                disposition: `attachment; filename="${file.originalname}"`,
            });
    }
}