import { Injectable } from '@nestjs/common'
import { config } from '../app.module'
import { LoggerService } from '../logger/logger.service'
import { ELogLevel } from '../logger/logger-interface'
const axios = require('axios')

@Injectable()
export class UptimeService {

    public constructor(private readonly lg: LoggerService) {
        if (config.dependentOnService !== '') {
            setInterval(async () => {

                const response = (await axios.get(config.dependentOnService)).data
                if (response.indexOf('authenticationToken') === -1) {
                    void this.lg.log(ELogLevel.Error, `Dependent on Service might be down`)
                }

            },          1 * 60 * 60 * 1000)
        }
    }
}
