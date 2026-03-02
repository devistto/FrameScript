import { Injectable } from "@nestjs/common";
import { TranscodeService } from "./transcode.service";
import { WhisperService } from "src/service/whisper.service";
import { IWhisperOptions } from "src/interface/Iwhisper-options";

@Injectable()
export class VideoService {
    constructor(
        private transcodeService: TranscodeService,
        private whisperService: WhisperService
    ) { }

    async create(filePath: string, options: IWhisperOptions) {
        await this.transcodeService.validate(filePath);
        const audioPath = await this.transcodeService.extract(filePath);

        const content = await this.whisperService.whisperCall(audioPath, options);

        const videoPath = await this.transcodeService.burn(filePath, content) as string;
        return videoPath
    }
}