# Video Captioner

Video Captioner is a self-hosted API designed to generate unlimited subtitled videos using high-precision speech recognition with Whisper.

### Pipeline

`Upload` → `Validate` → `Extract Audio` → `Generate Subtitles` → `Render Final Video`

## Features
- <u>[whisper-webservice](https://github.com/ahmetoner/whisper-asr-webservice)</u>

## Technologies

- TypeScript
- Docker / Docker Compose
- NestJS
- Node.js
- FFmpeg / FFprobe

## Usage

Try the deployed version for a quick demo (limited file size) [here](https://videocaptioner.onrender.com/doc).

### Set up

**NOTE:** Docker must be installed and running.

1 - Clone the repository
```bash
git clone https://github.com/devistto/VideoCaptioner.git
cd VideoCaptioner
```
2 - Once inside the repository directory
```bash
docker compose up --build
```

### Environment variables

- `ASR_ENGINE`: Engine selection (openai_whisper, faster_whisper, whisperx)
- `ASR_MODEL`: Model selection (tiny, base, small, medium, large-v3, etc.)
- `ASR_MODEL_PATH`: Custom path to store/load models
- `ASR_DEVICE`: Device selection (cuda, cpu)
- `MODEL_IDLE_TIMEOUT`: Timeout for model unloading
- `PORT`: Server port to listen on
- `WHISPER_APPROACH`: Approach selection (open_source, official)
- `OPENAI_KEY`: Required if `WHISPER_APPROACH=official`