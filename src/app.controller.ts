import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Test } from '@nestjs/testing'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Test()
  testGetHello() {
    expect(this.appService.getHello()).toBe('Hello World!')
  }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
