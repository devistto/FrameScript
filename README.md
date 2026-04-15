## VideoCaptioner

API focada na geração de vídeos com legendas precisas, utilizando o modelo Whisper para transcrição de áudio em texto e o FFmpeg para processamento de arquivos. O sistema implementa filas para o processamento assincrono de multiplas tarefas simultâneas, controle de execução, atualização e cancelamento em tempo real.

### Tecnologias
- NestJs
- JavaScript & TypeScript
- Node.js
- Socket.IO
- Redis
- BullMQ
- Docker
- Git
- Ffmpeg & Ffprobe
- HTML & CSS

### Instalação
O Docker é necessário para seguir com a instalação. Caso ainda não o tenha instalado, vejo como proceder no [Linux](https://docs.docker.com/engine/install/) ou [Windows](https://docs.docker.com/desktop/setup/install/windows-install/)

!: Clone o repositório localmente.
```bash
git clone https://github.com/devistto/VideoCaptioner
```
2: Inicie o servidor.
```bash
docker compose up --build
```

#: Acesse o arquivo de entradas em [http://localhost:8000](http://localhost:8000)

**Nota**: Durante o processamento, novos arquivos são gerados e poderão ser removidos em caso de falhas, reinicializações do servidor, cancelamento de tarefas ou após o salvamento local do resultado pelo usuário. 