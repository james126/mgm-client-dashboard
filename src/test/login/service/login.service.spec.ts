import value from '*.json'
import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha'
import { NGXLogger } from 'ngx-logger'
import { LoggerTestingModule, NGXLoggerMock } from 'ngx-logger/testing'
import { LoginData, LoginService, Result } from '../../../app/views/pages/login/service/login.service'
import { environment } from '../../../environments/environment.development'
import { loginData, validEmail } from '../dummy-data'

describe('LoginService', () => {
    let loginService: LoginService
    let httpMock: HttpTestingController
    let loginUrl: string
    let recaptchaUrl: string
    let passUrl: string
    let testData: LoginData

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, LoggerTestingModule, RecaptchaV3Module],
            providers: [LoginService, { provide: NGXLogger, useClass: NGXLoggerMock }, { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaV3 }],
        })

        loginService = TestBed.inject(LoginService)
        httpMock = TestBed.inject(HttpTestingController)
        loginUrl = `${environment.server}${environment.login}`
        recaptchaUrl = `${environment.server}${environment.recaptcha}`
        passUrl = `${environment.server}${environment.forgotPassEmail}`
        testData = loginData
    })

    it('Submit login', () => {
        const response = {
            outcome: true,
        }
        let actualResult: any

        loginService.login(testData).subscribe(result => {
            actualResult = result.outcome
        })

        const matchFn = (req: any) => {
            return req.url === loginUrl &&
                req.method === 'POST' &&
                req.body == testData
        }

        const request = httpMock.expectOne(matchFn)
        request.flush(response);
        httpMock.verify();

        expect(actualResult).toBe(response.outcome)
    })

    it('Submit login - handle response error', () => {
        const status = 500
        const statusText = 'Internal Server Error'
        const errorEvent = new ProgressEvent('Server Error')
        let actualError: HttpErrorResponse | null = null;

        loginService.login(testData).subscribe(res => {
            actualError = (res instanceof HttpErrorResponse ? res : null)
        })

        let request = httpMock.expectOne({ method: 'POST'}, loginUrl );
        request.error(errorEvent, { status, statusText });
        httpMock.verify()

        expect(true).not.toBeNull()
        expect(actualError!.error).toBe(errorEvent);
        expect(actualError!.status).toBe(status);
        expect(actualError!.statusText).toBe(statusText);
    })

    it('Submit recaptcha', () => {
        const token = "123456"
        const response = {
            score: 1
        }
        let actualResult: any

        loginService.submitRecaptcha(token).subscribe((res: number | HttpErrorResponse )=> {
            actualResult = res
        })

        const matchFn = (req: any) => {
            return req.url === recaptchaUrl &&
                req.method === 'POST' &&
                req.body == token
        }

        const request = httpMock.expectOne(matchFn)
        request.flush(response);
        httpMock.verify();

        expect(actualResult).toBe(response.score)
    })

    it('Submit forgot password', () => {
        const username = validEmail
        const response = new Result(true, null)
        let actualResult: any

        loginService.forgotPassCheck(validEmail).subscribe((res: Result | HttpErrorResponse )=> {
            if (res.constructor === Result) {
                actualResult = res.outcome
            }
        })

        const matchFn = (req: any) => {
            return req.url === passUrl &&
                req.method === 'POST' &&
                req.body == validEmail
        }

        const request = httpMock.expectOne(matchFn)
        request.flush(response);
        httpMock.verify();

        expect(actualResult).toBe(response.outcome)
    })
})
