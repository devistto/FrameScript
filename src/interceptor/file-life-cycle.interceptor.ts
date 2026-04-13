import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { FileLifeCycleService } from 'src/service/file-life-cycle.service';

@Injectable()
export class FileLifeCycleInterceptor implements NestInterceptor {
    constructor(private fileService: FileLifeCycleService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse<Response>();
        const request = context.switchToHttp().getRequest<Request>();

        const folderPth = request.file!.path
        
        request.on("aborted", async () => {
            await this.fileService.cleanup(folderPth);
        });
        response.on("error", async () => {
            await this.fileService.cleanup(folderPth);
        });

        return next.handle()
    }
}