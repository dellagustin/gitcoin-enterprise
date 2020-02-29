import * as fs from 'fs-sync'
import * as path from 'path'
import { IFunding, IApplication } from '../interfaces'

export class CommentProvider {
    // private static readonly templatesFolder = path.join(path.resolve(''), './server/templates')
    private static readonly templatesFolder = CommentProvider.getPathToTemplates()

    public static getPathToTemplates() {

        // tslint:disable-next-line: no-console
        console.log(__dirname)

        return (__dirname.indexOf('dist') === -1) ?
            path.join(__dirname, '../../templates') :
            path.join(__dirname, '../../templates')
    }
    public static getCommentAboutSuccessfullFunding(totalAmount: number, funding: IFunding): any {
        let commentBody
        if (totalAmount > funding.amount) {
            const templateFileId = `${CommentProvider.templatesFolder}/comment-on-funding-multiple.md`
            // tslint:disable-next-line: no-console
            console.log(`using template file: ${templateFileId}`)

            commentBody =
                fs.read(templateFileId).toString()
                    .replace('{{{amount}}}', funding.amount)
                    .replace('{{{funder}}}', funding.funderId)
                    .replace('{{{totalAmount}}}', totalAmount)
        } else if (totalAmount === funding.amount) {
            // const templateFileId = path.join(__dirname, '../../templates/comment-on-funding.md')
            const templateFileId = `${CommentProvider.templatesFolder}/comment-on-funding.md`
            // tslint:disable-next-line: no-console
            console.log(`using template file: ${templateFileId}`)

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
        const templateFileId = `${CommentProvider.templatesFolder}/comment-on-application.md`
        const body = fs.read(templateFileId).toString().replace('{{{applicant}}}', application.profileLink).replace('{{{plan}}}', application.plan)

        return body
    }

    public static getCommentAboutSuccessfullTransfer(funding: IFunding): any {
        const templateFileId = `${CommentProvider.templatesFolder}/comment-on-transfer.md`
        const body = fs.read(templateFileId).toString().replace('{{{amount}}}', funding.amount)

        return body
    }
}
