import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { rmSync } from "fs";

@Injectable()
export class AppService implements OnApplicationBootstrap {
    onApplicationBootstrap() {
        rmSync(`${process.cwd()}/tmp`, {
            recursive: true,
            force: true
        })
    }
}