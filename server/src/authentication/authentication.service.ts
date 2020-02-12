import { Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import * as fs from 'fs-sync'
import * as path from 'path'
import { IAuthenticationData } from '../interfaces'
import { ELogLevel } from '../logger/logger-interface'

@Injectable()
export class AuthenticationService {

    private static authenticationData: IAuthenticationData[] = []

    public constructor(private readonly lg: LoggerService) { }

    public getAuthenticationData(userAccessToken: string): IAuthenticationData {
        return AuthenticationService.authenticationData.filter((aD: IAuthenticationData) => aD.token === userAccessToken)[0]
    }

    public addAuthenticationData(aD: IAuthenticationData): void {
        if (AuthenticationService.authenticationData.filter((entry: IAuthenticationData) => entry.token === aD.token)[0] !== undefined) {
            this.lg.log(ELogLevel.Error, 'Token is already in file')
        } else {
            AuthenticationService.authenticationData.push(aD)
        }
    }
}
