export interface IAuthenticationData {
  avatarURL: string
  login: string
  token: string
}

export interface IssueInfo {
  title: string
  description: string
}

export interface ITask {
  link: string
  taskType: ETaskType
  title: string
  description: string
  funding: number
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

export interface IInvitationListFromUser {
  from: string
  invitedFriends: IInvitedFriend[]
}

export interface IInvitedFriend {
  eMail: string,
  date: string
}

export interface IApplication {
  applicantUserId: string
  plan: string
  profileLink: string
  taskLink: string
}

export interface IEmail {
  senderUserId: string
  sender: string
  recipient: string
  subject: string
  content: string
}
export interface IUser {
  login: string
  balance: number
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

export interface IConfig {
  port: number
  backendURL: string
  logLevel: number
  certificateFile: string
  certificatePrivateKeyFile: string
  ledgerConnector: any
  enterpriseInternalCollaborationCurrency: string
  enterpriseInternalCollaborationCurrencySymbol: string
  token: string
  eMail: string
  pw: string
  invitationsPerUserPerDay: number
  smtpHost: string
  notifierToken: string
  notifierSupportChannel: string
  gitHubOAuthClient: string
  gitHubOAuthSecret: string
  testMode: boolean
  gitHubAPIBaseURL: string
  gitHubURL: string
  dependentOnService: string
}
