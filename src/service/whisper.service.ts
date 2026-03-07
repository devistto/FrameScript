import "dotenv/config";
import { readFile } from "fs/promises";
import { ParamOptions } from "src/interface/Iwhisper-options";
import OpenAI from "openai";
import fs from 'node:fs';
import { URLSearchParams } from "node:url";

type WhisperAproach = "open_source" | "official"

export class WhisperService {
    private instance = new OpenAI({ apiKey: process.env.OPENAI_KEY });
    private readonly HOW_WHISPER = process.env.WHISPER_APROACH as WhisperAproach

    async call(data: ParamOptions): Promise<string> {
        return this.HOW_WHISPER === "open_source"
            ? await this.openSource(data)
            : await this.openai(data)
    }

    private async openai(data: ParamOptions): Promise<string> {
        const file = fs.createReadStream(data.filePth);

        if (data.options.task === "translate") {
            const res = await this.instance.audio.translations.create({
                file,
                model: "whisper-1",
                response_format: "srt"
            });
            return String(res);
        }

        const res = await this.instance.audio.transcriptions.create({
            file,
            model: "whisper-1",
            response_format: "srt",
            language: data.options.audio_language
        });

        return res;
    }

    // fallbck
    private async openSource(data: ParamOptions) {
        const baseUrl = "http://whisper-asr:9000/asr";
        const params = new URLSearchParams({
            task: data.options.task,
            language: data.options.audio_language,
            output: "srt",
        });

        const buffer = await readFile(data.filePth);

        const formData = new FormData();
        formData.append("audio_file", new Blob([buffer], { type: "audio/wav" }), "audio.wav");

        const res = await fetch(`${baseUrl}?${params}`, {
            method: "POST",
            body: formData,
        });

        return await res.text();
    }
}