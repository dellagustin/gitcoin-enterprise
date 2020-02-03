import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getIssues(): string[] {
    return [];
  }
  public getHello(): string {
    return 'Hello World!';
  }
}
