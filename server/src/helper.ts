import moment = require('moment')

export class Helper {
    public static isItLongerAgoThan(value: number, unit: moment.unitOfTime.DurationConstructor, previousMoment: any) {
        if (moment().subtract(value, unit).isAfter(previousMoment)) {
            return true
        } else {
            return false
        }
    }
}
