import { ETaskStatus, BackendService } from '../backend.service'
import { ETaskType, ITask } from '../interfaces'

export class TaskHelper {

  public static getInitialTask(): ITask {
    return {
      link: `${BackendService.gitHubURL}/gitcoin-enterprise/gitcoin-enterprise/issues/24`,
      taskType: ETaskType.GitHubIssue,
      funding: 0,
      title: '',
      description: '',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5,
      dueDate: '',
    }
  }

  public static getDemoTaskLink(): string {
    if (document.URL === 'https://gitcoin-enterprise.org') { return `${BackendService.gitHubURL}/gitcoin-enterprise/gitcoin-enterprise/issues/24` }

    return `${BackendService.gitHubURL}/gitcoin-enterprise/gitcoin-enterprise/issues/25`
  }

}
