import { Injectable } from '@nestjs/common'

import { AppService } from './app.service'

@Injectable()
export class TestService {
  constructor(private appService: AppService) {}

  testMethod() {
    const unusedVariable = 'test'
    const _intentionallyUnused = 'this is ok'

    return this.appService.getHello()
  }
}
