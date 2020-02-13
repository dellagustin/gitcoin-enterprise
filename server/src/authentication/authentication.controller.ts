import { Controller, Get, Req, Res, Query } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { pathToStaticAssets } from '../../dist/main'
import * as fs from 'fs-sync'
import * as path from 'path'

@Controller('authentication')
export class AuthenticationController {

    public constructor(private readonly authenticationService: AuthenticationService) { }

    @Get('/login')
    login(@Req() req: any, @Res() res: any, @Query('action') action: string): void {
        this.authenticationService.keepTheAction(action, req.connection.remoteAddress)
        // res.statusCode = 302
        // res.setHeader('location', this.authenticationService.getOAUTHLoginURL())
        // res.end()
        res.redirect(this.authenticationService.getOAUTHLoginURL())
    }

    @Get('/github/callback')
    public async handleCallback(@Req() req: any, @Res() res: any): Promise<any> {
        const newToken = await this.authenticationService.handleGitHubCallback(req.query.code, req.query.state)
        await this.authenticationService.handleNewToken(newToken)

        // just for demo reasons :) - motivating JSON Web Tokens with my students
        res.send(fs.read(`${pathToStaticAssets}/i-want-compression-via-route.html`)
            .replace('authenticationTokenContent', newToken)
            .replace('actionsForRedirectingConvenientlyAfterLogin', this.authenticationService.getActionForAddress(req.connection.remoteAddress)))

    }

}
