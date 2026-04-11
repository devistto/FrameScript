import { readFile } from "fs/promises";
import { TranscriptionDataDto } from "src/dto/transcription-data.dto";

const createTranscription = async (
    audioPath: string,
    dto: TranscriptionDataDto
) => {
    const baseUrl = "http://whisper-asr:9000/asr";

    const queryParams = new URLSearchParams({
        task: dto.translate ? "translate" : "transcribe",
        language: dto.lang ?? "",
        initial_prompt: dto.initial_prompt || "",
        vad_filter: String(dto.vad_filter || "false"),
        output: "srt"
    });

    const buffer = await readFile(audioPath);

    const formData = new FormData();
    formData.append(
        "audio_file",
        new Blob([buffer], { type: "audio/wav" }),
        "audio.wav"
    );

    const res = await fetch(`${baseUrl}?${queryParams}`, {
        method: "POST",
        body: formData
    });

    return await res.text();
}

export default createTranscription