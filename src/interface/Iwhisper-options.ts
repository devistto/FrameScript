import { WhisperLanguage, WhisperTask } from "src/dto/whisper-options.dto";

interface IWhisperOptions {
    task: WhisperTask
    audio_language: WhisperLanguage;
}

export interface ParamOptions {
    filePth: string,
    options: IWhisperOptions
}