import { Injectable } from "@nestjs/common";
import fs from 'node:fs'
import path from "node:path";

@Injectable()
export class FileLifecycleService {
    private files = new Map<string, string>();

    insert(id: string, filePath: string) {
        const folderPath = path.dirname(filePath);
        this.files.set(id, folderPath)
    }

    async delete(id: string) {
        const dir = this.files.get(id);

        if (!dir) return;

        try {
            fs.rmSync(dir, { recursive: true, force: true });
        } catch (err) {
            console.log(err)
        } finally {
            this.files.delete(id)
        }
    }
}