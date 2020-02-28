import { Controller, Get, Req, Res, Query } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { config } from '../app.module'

@Controller()
export class AuthenticationController {

    public constructor(private readonly authenticationService: AuthenticationService) { }

    @Get('/authentication/login')
    public login(@Req() req: any, @Res() res: any, @Query('action') action: string): void {
        this.authenticationService.keepTheAction(action, req.connection.remoteAddress)
        res.redirect(this.authenticationService.getOAUTHLoginURL(this.authenticationService.addState()))
    }

    @Get('/authentication/github/callback')
    public async handleCallback(@Req() req: any, @Res() res: any): Promise<any> {
        const authenticationData = await this.authenticationService.handleAuthenticationFromCode(req.query.code, req.query.state)
        res.redirect(this.authenticationService.getRedirectURL(req.connection.remoteAddress, authenticationData))
    }

    @Get('/login/oauth/authorize') // this route is only needed for test purposes - test doubling an oauth provider - if you have an idea how to do this better create a PR
    public authorize(@Req() req: any, @Res() res: any, @Query('state') state: string): void {
        res.redirect(`${config.backendURL}/authentication/github/callback?state=${state}`)
    }

}
