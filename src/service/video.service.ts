import { Injectable } from "@nestjs/common";
import { TranscodeService } from "./transcode.service";
import { WhisperService } from "src/service/whisper.service";
import { ParamOptions } from "src/interface/Iwhisper-options";

@Injectable()
export class VideoService {
    constructor(
        private readonly transcodeService: TranscodeService,
        private readonly whisperService: WhisperService
    ) { }

    async create(data: ParamOptions) {
        await this.transcodeService.validate(data.filePth);
        const audioPath = await this.transcodeService.extract(data.filePth);

        const content = await this.whisperService.call({ filePth: audioPath, options: data.options });

        return await this.transcodeService.burn(data.filePth, content)
    }
}