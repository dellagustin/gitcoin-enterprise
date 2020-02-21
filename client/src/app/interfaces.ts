export interface IAuthenticationData {
  avatarURL: string
  login: string
  token: string
}

export interface IssueInfo {
  title: string
  description: string
}

export interface IApplication {
  plan: string
  taskLink: string
}

export interface ITask {
  link: string
  taskType: ETaskType
  funding: number
  title: string
  description: string
  status: ETaskStatus
  funderRatedWith: number
  solutionProviderRatedWith: number
  dueDate: string
}

export enum ETaskStatus {
  'created' = 1,
  'inProgress' = 2,
  'completed' = 3,
  'paid' = 4,
}

export enum ETaskType {
  'GitHubIssue' = 1,
  'tbd...' = 2,
}

export interface ILedgerEntry {
  id: string,
  date: string,
  amount: number,
  sender: string
  receiver: string
}

export interface IEmail {
  recipient: string,
  subject: string
  content: string
}

export interface IBountiesAndFundings {
fundings: IFunding[]
bounties: IBounty[]
}

export interface IBounty {
  bountyHunterId: string
  taskLink: string
  amount: number
}

export interface IFunding {
  id: string
  funderId: string
  taskLink: string
  amount: number
}

export interface ITaskAndFunding {
  task: ITask
  funding: IFunding
}

export interface IMessage {
  text: string
  fromChatBot: boolean
}
