import { BadRequestException, Injectable } from "@nestjs/common";
import path from "path";
import fs from "node:fs"
import ffmpeg from "src/config/ffmpeg-config";

@Injectable()
export class TranscodeService {
    private ensureVideoFile(videoPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) return reject(
                    new BadRequestException("Unable to read file metadata")
                );

                const isVideo = metadata.streams?.find(stream => stream.codec_type === "video");

                if (!isVideo) return reject(
                    new BadRequestException("Unable to validate file properities")
                )

                return resolve()
            });
        })
    }

    async extractAudio(videoPath: string): Promise<string> {
        this.ensureVideoFile(videoPath)
        const audioPath = path.join(path.dirname(videoPath), "audio.wav");

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .noVideo()
                .audioCodec('pcm_s16le')
                .format("wav")
                .on('end', () => resolve(audioPath))
                .on("error", err => {
                    console.log(err);
                    reject(new Error("File processing failed."))
                })
                .save(audioPath);
        })
    }

    async burnSubtitles(videoPath: string, subtitles: string): Promise<string> {
        const dir = path.dirname(videoPath);
        const textFilePath = path.join(dir, 'subtitle.srt');

        fs.writeFileSync(textFilePath, subtitles, { encoding: "utf8" });

        const outputPath = path.join(dir, "output.mp4");
        const normalizedSrtPath = textFilePath.split(path.sep).join("/");

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .outputOptions([
                    `-vf subtitles='${normalizedSrtPath}:force_style=FontName=Arial,FontSize=10,PrimaryColour=&H00FFFFFF,Outline=0.6,OutlineColour=&H70000000,Shadow=0.6,BackColour=&H80000000,Alignment=2,MarginV=30'`,
                    "-c:a copy"
                ])
                .videoCodec("libx264")
                .format("mp4")
                .on("end", () => resolve(outputPath))
                .on("error", err => {
                    console.log(err);
                    reject(new Error("File processing failed."))
                })
                .save(outputPath);
        });
    }
}