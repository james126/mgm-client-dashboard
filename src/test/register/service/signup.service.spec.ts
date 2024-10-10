import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { TestBed } from '@angular/core/testing'
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha'
import { NGXLogger } from 'ngx-logger'
import { LoggerTestingModule, NGXLoggerMock } from 'ngx-logger/testing'
import { environment } from '../../../environments/environment.development'
import { SignupService } from '../../../app/views/pages/register/service/signup.service'
import { username } from '../dummy-data'

describe('SignupService', () => {
    let signupService: SignupService
    let mock: HttpTestingController
    let usernameUrl: string
    let name: string

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, LoggerTestingModule, RecaptchaV3Module],
            providers: [SignupService, { provide: NGXLogger, useClass: NGXLoggerMock }, { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaV3 }],
        })

        signupService = TestBed.inject(SignupService)
        mock = TestBed.inject(HttpTestingController)
        name = username;
        usernameUrl = `${environment.server}${environment.usernameTaken}?userName=${username}`
    })

    it('Check if username taken', () => {
        const response = {
            usernameTaken: true,
            status: HttpStatusCode.Ok,
        }
        let actualResult: any

        signupService.isUsernameTaken(name).subscribe(result => {
            actualResult = result
        })

        // const request = mock.expectOne({ method: 'GET', url: requestUrl })
        const matchFn = (req: any) => {
            return req.url === `${environment.server}${environment.usernameTaken}` &&
                req.method === 'GET' &&
                req.params.has('username')
                && req.params.get('username') === name;
        }
        const request = mock.expectOne(matchFn);
        request.flush(response)
        mock.verify()

        expect(actualResult).toBe(response.usernameTaken)
    })

    it('Handles response errors', () => {
        const status = 500
        const statusText = 'Internal Server Error'
        const errorEvent = new ProgressEvent('Server Error')

        let actualError: HttpErrorResponse | null = null;

        signupService.isUsernameTaken(username).subscribe((res: boolean | HttpErrorResponse) => {
                actualError = (res instanceof HttpErrorResponse ? res : null)
            }
        )

        let request = mock.expectOne({ method: 'GET'}, usernameUrl );
        request.error(errorEvent, { status, statusText });
        mock.verify()

        expect(true).not.toBeNull()
        expect(actualError!.error).toBe(errorEvent);
        expect(actualError!.status).toBe(status);
        expect(actualError!.statusText).toBe(statusText);
    })
})
