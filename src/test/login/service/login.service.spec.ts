import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { NGXLogger } from 'ngx-logger'
import { LoggerTestingModule, NGXLoggerMock } from 'ngx-logger/testing'
import { LoginData, LoginService } from '../../../app/views/pages/login/service/login.service'
import { environment } from '../../../environments/environment.development'
import { loginData } from '../dummy-data'

describe('LoginService', () => {
    let loginService: LoginService
    let httpMock: HttpTestingController
    let loginUrl: string
    let recaptchaUrl: string
    let passUrl: string
    let testData: LoginData

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, LoggerTestingModule],
            providers: [LoginService, { provide: NGXLogger, useClass: NGXLoggerMock }],
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
            success: true,
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

        expect(actualResult).toBe(response.success)
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

    xit('Submit forgot password', () => {
        const username = testData.username
        const response = {
            responseStatus: 200
        }
        let actualResult: any

        loginService.forgotPassCheck(username).subscribe((res: boolean | HttpErrorResponse )=> {
            actualResult = res
        })

        const matchFn = (req: any) => {
            return req.url === passUrl &&
                req.method === 'POST' &&
                req.body == username
        }

        const request = httpMock.expectOne(matchFn)
        request.flush(response);
        httpMock.verify();

        expect(actualResult).toBe(response.responseStatus)
    })
})
