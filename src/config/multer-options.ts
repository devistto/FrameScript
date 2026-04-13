import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer"
import path from "path";
import fs from "node:fs"
import { customAlphabet } from "nanoid"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);

const allowedMimeTypes = [
    "video/mp4", "video/mpeg", "video/quicktime", "video/mov", "video/wmv",
    "video/x-msvideo", "video/avi", "video/webm", "video/ogg", "video/x-flv",
    "video/3gpp", "video/3gpp2", "video/x-matroska", "video/x-ms-wmv", "video/ts",
    "video/mp2t", "video/x-f4v", "video/x-m4v", "video/x-mpeg", "video/x-mng",
    "video/3gpp-tt", "video/ivf", "video/vnd.rn-realvideo", "video/vnd.vivo",
    "video/x-sgi-movie", "video/x-ms-asf", "video/x-msvideo", "video/x-ms-wvx",
    "video/x-ms-wmx", "video/x-ms-wm", "video/x-ms-wmv", "video/x-ms-wmvd",
    "video/x-ms-wmvr", "video/x-ms-wmx", "video/x-ms-wvx", "video/x-flv",
    "video/webm", "video/ogg", "video/x-theora", "video/x-dv", "video/x-mkv",
    "video/3gpp", "video/3gpp2",
];

export const multerOptions: MulterOptions = {
    storage: diskStorage({
        destination(req, file, callback) {
            const base = path.join(process.cwd(), "tmp");
            const filePath = path.join(base, nanoid());

            fs.mkdirSync(filePath, { recursive: true });

            callback(null, filePath)
        },
        filename(req, file, callback) {
            callback(null, file.originalname)
        },
    }),
    fileFilter(req, file, callback) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            callback(
                new BadRequestException(`Acceptable mimetypes values: ${allowedMimeTypes}`),
                false
            )
        };

        callback(null, true)
    }
} 