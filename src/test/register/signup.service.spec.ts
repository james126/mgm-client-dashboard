import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { TestBed } from '@angular/core/testing'
import { NGXLogger } from 'ngx-logger'
import { LoggerTestingModule, NGXLoggerMock } from 'ngx-logger/testing'
import { environment } from 'src/environments/environment.development'
import { SignupService } from '../../app/views/pages/register/services/signup.service'
import { username } from './util/register-dummy-data'

describe('SignupService', () => {
    let signupService: SignupService
    let controller: HttpTestingController
    let usernameUrl: string
    let name: string

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, LoggerTestingModule],
            providers: [SignupService, { provide: NGXLogger, useClass: NGXLoggerMock }],
        })

        signupService = TestBed.inject(SignupService)
        controller = TestBed.inject(HttpTestingController)
        name = username;
        usernameUrl = `${environment.server}${environment.usernameTaken}?userName=${username}`
    })

    it('check is username taken', () => {
        const response = {
            usernameTaken: true,
            status: HttpStatusCode.Ok,
        }
        let actualResult: any

        signupService.isUsernameTaken(name).subscribe(result => {
            actualResult = result
        })

        // const request = controller.expectOne({ method: 'GET', url: requestUrl })
        const matchFn = (req: any) => {
            return req.url === `${environment.server}${environment.usernameTaken}` &&
                req.method === 'GET' &&
                req.params.has('username')
                && req.params.get('username') === name;
        }
        const request = controller.expectOne(matchFn);
        request.flush(response)
        controller.verify()

        expect(actualResult).toBe(response.usernameTaken)
    })

    it('handles response errors', () => {
        const status = 500
        const statusText = 'Internal Server Error'
        const errorEvent = new ProgressEvent('Server Error')

        let actualError: HttpErrorResponse | null = null;

        signupService.isUsernameTaken(username).subscribe((res: boolean | HttpErrorResponse) => {
                actualError = (res instanceof HttpErrorResponse ? res : null)
            }
        )

        let request = controller.expectOne({ method: 'GET'}, usernameUrl );
        request.error(errorEvent, { status, statusText });
        controller.verify()

        expect(true).not.toBeNull()
        expect(actualError!.error).toBe(errorEvent);
        expect(actualError!.status).toBe(status);
        expect(actualError!.statusText).toBe(statusText);
    })
})
