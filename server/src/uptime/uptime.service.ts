import { Injectable } from '@nestjs/common'
import { config } from '../app.module'
import { ELogLevel } from '../../dist/logger/logger-interface'
import { LoggerService } from '../logger/logger.service'
const axios = require('axios')

@Injectable()
export class UptimeService {

    public constructor(private readonly lg: LoggerService) {
        if (config.dependentOnService !== '') {
            setInterval(async () => {

                const response = (await axios.get(config.dependentOnService)).data
                if (response.indexOf('authenticationToken') === -1) {
                    this.lg.log(ELogLevel.Error, `Dependent on Service might be down`)
                }

            }, 2 * 60 * 60 * 1000)
        }
    }
}
