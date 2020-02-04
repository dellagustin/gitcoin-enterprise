import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    // const app: TestingModule = await Test.createTestingModule({
    //   controllers: [AppController],
    //   providers: [AppService],
    // }).compile();

    // appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const expectedResult = { issueDescription: 'my issue description', issueTitle: 'my issue title' };
      // expect(await appController.getIssue('testOrg', 'testRepo', 2)).toEqual(expectedResult);
      // todo
    });
  });
});
