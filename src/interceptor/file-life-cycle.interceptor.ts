import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { FileLifecycleService } from 'src/service/file-lifecycle.service';

@Injectable()
export class FileLifeCycleInterceptor implements NestInterceptor {
    constructor(private fileLifecycle: FileLifecycleService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse<Response>();
        const request = context.switchToHttp().getRequest<Request>();

        const folderPth = request.file!.path
        
        request.on("aborted", async () => {
            await this.fileLifecycle.delete(folderPth);
        });
        response.on("error", async () => {
            await this.fileLifecycle.delete(folderPth);
        });

        return next.handle()
    }
}