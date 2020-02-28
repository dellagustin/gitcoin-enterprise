import * as fs from 'fs-sync'
import * as path from 'path'
import { IFunding, IApplication } from '../../dist/interfaces'

export class CommentProvider {
    public static getCommentAboutSuccessfullFunding(totalAmount: number, funding: IFunding): any {
        let commentBody
        if (totalAmount > funding.amount) {
            const templateFileId = path.join(__dirname, '../../src/github-integration/comment-on-funding-multiple.md')
            commentBody =
                fs.read(templateFileId).toString()
                    .replace('{{{amount}}}', funding.amount)
                    .replace('{{{funder}}}', funding.funderId)
                    .replace('{{{totalAmount}}}', totalAmount)
        } else if (totalAmount === funding.amount) {
            const templateFileId = path.join(__dirname, '../../src/github-integration/comment-on-funding.md')
            commentBody =
                fs.read(templateFileId).toString()
                    .replace('{{{amount}}}', funding.amount)
                    .replace('{{{funder}}}', funding.funderId)
        } else {
            throw new Error('check total amount and funding amount')
        }

        return commentBody
    }

    public static getCommentAboutSolutionApproach(application: IApplication): any {
        const templateFileId = path.join(__dirname, '../../src/github-integration/comment-on-application.md')
        const body = fs.read(templateFileId).toString().replace('{{{applicant}}}', application.profileLink).replace('{{{plan}}}', application.plan)

        return body
    }

    public static getCommentAboutSuccessfullTransfer(funding: IFunding): any {
        const templateFileId = path.join(__dirname, '../../src/github-integration/comment-on-funding.md')
        const body = fs.read(templateFileId).toString().replace('{{{amount}}}', funding.amount)

        return body
    }
}
