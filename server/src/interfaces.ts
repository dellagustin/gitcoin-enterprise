export interface IssueInfo {
  title: string
  description: string
}

export interface ITask {
  taskType: ETaskType
  name: string
  description: string
  funding: number
  currency: string
  status: ETaskStatus
  funderRatedWith: number
  solutionProviderRatedWith: number
  link: string
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
  sender: string,
  recipient: string,
  subject: string
  content: string
}
export interface IUser {
  companyId: string
  firstName: string
  balance: number
  link: string
}
