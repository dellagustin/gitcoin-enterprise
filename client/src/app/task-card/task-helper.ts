import { BackendService } from '../backend.service'
import { ITask } from '../interfaces'

export class TaskHelper {

  public static getInitialTask(): ITask {
    return {
      link: `${BackendService.gitHubURL}/gitcoin-enterprise/gitcoin-enterprise/issues/24`,
      funding: 0,
      title: '',
      description: '',
    }
  }

  public static getDemoTaskLink(): string {
    if (document.URL === 'https://gitcoin-enterprise.org') { return `${BackendService.gitHubURL}/gitcoin-enterprise/gitcoin-enterprise/issues/24` }

    return `${BackendService.gitHubURL}/gitcoin-enterprise/gitcoin-enterprise/issues/25`
  }

}
