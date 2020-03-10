export interface IAuthenticationData {
  avatarURL: string
  login: string
  id: string
  p2pAccessToken: string
}

export interface IIssueInfo {
  title: string
  description: string
}

export interface IApplication {
  applicantUserId: string
  plan: string
  taskLink: string
}

export interface ITask {
  link: string
  title: string
  description: string
  funding: number
}

export enum ETaskStatus {
  'created' = 1,
  'inProgress' = 2,
  'completed' = 3,
  'paid' = 4,
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

export interface IBountyReceiver {
  login: string
  amount: number
  bountyForTaskLink: string
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
