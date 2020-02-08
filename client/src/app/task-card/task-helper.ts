import { ETaskType, ITask, ETaskStatus } from '../backend.service'

export class TaskHelper {
  public static getInitialTask(): ITask {
    return {
      id: '',
      taskType: ETaskType.GitHubIssue,
      name: '',
      description: '',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5,
      link: 'https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/16',
      dueDate: ''
    }
  }

}
