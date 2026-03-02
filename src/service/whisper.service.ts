import "dotenv/config";
import { readFile } from "fs/promises";
import { IWhisperOptions } from "src/interface/Iwhisper-options";
import OpenAI from "openai";
import fs from 'node:fs';

export class WhisperService {
    async whisperCall(audioPath: string, options: IWhisperOptions) {
        let content = "";

        try {
            content = await this.openai(audioPath, options) as string
        } catch (err) {
            console.log(err);
            content = await this.openSource(audioPath, options);
        }

        return content;
    }

    private async openSource(audioPath: string, options: IWhisperOptions) {
        const baseUrl = "http://whisper-asr:9000/asr?";
        const queryParams = `task=${options.task}&language=${options.audio_language}&output=srt`;
        const url = baseUrl + queryParams;

        const buffer = await readFile(audioPath);
        const blob = new Blob([buffer], { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio_file", blob, "audio.wav");

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        return await response.text();
    }

    private async openai(audioPath: string, options: IWhisperOptions) {
        if (!process.env.OPENAI_KEY) console.log("OPENAI_KEY not found");

        const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

        if (options.task === "translate") {
            const translation = await openai.audio.translations.create({
                file: fs.createReadStream(audioPath),
                model: "whisper-1",
                response_format: "srt"
            });
            return translation;
        }

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioPath),
            model: "whisper-1",
            response_format: "srt",
            language: options.audio_language
        });

        return transcription;
    }
}