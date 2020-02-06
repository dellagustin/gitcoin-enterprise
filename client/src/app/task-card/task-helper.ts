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
      link: 'https://github.com/cla-assistant/cla-assistant/issues/530',
      dueDate: ''
    }
  }

}
