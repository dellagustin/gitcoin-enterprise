
export enum ELogLevel {
    Error = 1,
    Warning = 2,
    Info = 3,
}

export interface ILogger {
    logLevel: ELogLevel
    log(messageType: ELogLevel, message: string): Promise<void>
}
