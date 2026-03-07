import { Body, Controller, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { multerOptions } from 'src/utils/multer-options';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from 'src/service/video.service';
import { WhisperLanguage, WhisperOptionsDto } from 'src/dto/whisper-options.dto';
import { createReadStream } from 'fs';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CleanUpInterceptor } from 'src/interceptor/clean-up.interceptor';

@Controller('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Post()
    @UseInterceptors(FileInterceptor('video', multerOptions), CleanUpInterceptor)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: 'Create a subtitled video',
        description: 'Uploads a video, processes it using Whisper and FFmpeg, and returns the final MP4 with embedded subtitles.'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    format: 'binary',
                    description: 'At most 100MB video file - Supports MP4, MPEG, QuickTime, WMV, AVI, WebM, Ogg, FLV, 3GPP, 3GPP2 formats'
                },
                task: {
                    type: 'string',
                    enum: ['translate', 'transcribe'],
                    default: 'transcribe'
                },
                audio_language: {
                    type: 'string',
                    enum: Object.values(WhisperLanguage),
                    default: WhisperLanguage.English
                }
            },
            required: ['task', 'video', 'audio_language']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Returns a processed video with embedded subtitles.',
        content: {
            'video/mp4': {
                schema: { type: 'string', format: 'binary' }
            }
        }
    })
    @ApiBadRequestResponse({
        description: 'Invalid request: missing file, exceeded file size / duration limit or else.',
        schema: {
            example: {
                statusCode: 400,
                message: 'File is missing',
                error: 'Bad Request'
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 500,
                message: 'Something went wrong while processing file',
                error: 'Internal Server Error'
            }
        }
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: WhisperOptionsDto
    ): Promise<StreamableFile> {
        const videoPath = await this.videoService.create({ filePth: file.path, options: dto });

        return new StreamableFile(
            createReadStream(videoPath),
            {
                type: 'video/mp4',
                disposition: `attachment; filename="${file.originalname}"`,
            });
    }
}