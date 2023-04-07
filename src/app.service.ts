import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getPing(): string {
    const port = this.getPort();

    return `Server is running! Go to http://localhost:${port}/api to see the API documentation. 🚀🚀🚀`;
  }

  private getPort(): number {
    const port: number = this.configService.get('port');

    return port;
  }
}
