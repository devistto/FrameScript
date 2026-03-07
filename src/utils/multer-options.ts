import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer"
import path from "path";
import fs from "node:fs"
import { customAlphabet } from "nanoid"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);

const allowedMimeTypes = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/mov",
    "video/wmv",
    "video/avi",
    "video/x-msvideo",
    "video/webm",
    "video/ogg",
    "video/x-flv",
    "video/3gpp",
    "video/3gpp2",
    "video/x-matroska",
];

export const multerOptions: MulterOptions = {
    storage: diskStorage({
        destination(req, file, callback) {
            const base = path.join(process.cwd(), "temp");
            const filePath = path.join(base, nanoid());

            fs.mkdirSync(filePath, { recursive: true });

            callback(null, filePath)
        },
        filename(req, file, callback) {
            callback(null, file.originalname)
        },
    }),
    limits: {
        fileSize: 150 * 1024 * 1024
    },

    fileFilter(req, file, callback) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            callback(
                new BadRequestException(`Acceptable mimetypes incluede ${allowedMimeTypes}`),
                false
            )
        };

        callback(null, true)
    }
} 