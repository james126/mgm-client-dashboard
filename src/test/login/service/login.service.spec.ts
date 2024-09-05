import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { NGXLogger } from 'ngx-logger'
import { LoggerTestingModule, NGXLoggerMock } from 'ngx-logger/testing'
import { LoginData, LoginResult, LoginService } from '../../../app/views/pages/login/service/login.service'
import { environment } from '../../../environments/environment.development'


describe('LoginService', () => {
    let loginService: LoginService
    let httpMock: HttpTestingController
    let loginUrl: string
    let recaptchaUrl: string
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
        testData = {
            username: 'Joseph',
            password: 'Welcome862#'
        }
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

    })

    it('Submit recaptcha', () => {

    })

    it('Submit recaptcha - handle response error', () => {

    })
})
