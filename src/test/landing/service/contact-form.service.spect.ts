import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { MockProvider } from 'ng-mocks'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { NGXLogger } from 'ngx-logger'
import { NGXLoggerMock } from 'ngx-logger/testing'
import { SubmitFormResult, ContactFormService } from '../../../app/views/pages/landing/service/contact-form.service'
import { Contact } from '../../../app/views/pages/landing/dto/contact'
import { environment } from '../../../environments/environment'

describe('ContactFormService', () => {
    let submitService: ContactFormService
    let httpMock: HttpTestingController
    let server = environment.server
    let path = '/contact-form'
    let url = ''
    let contact: Contact

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ContactFormService, { provide: NGXLogger, useClass: NGXLoggerMock }, MockProvider(ReCaptchaV3Service)],
        })

        submitService = TestBed.inject(ContactFormService)
        httpMock = TestBed.inject(HttpTestingController)

        contact = new Contact()
        contact.first_name = 'Joe'
        contact.last_name = 'Bloggs'
        contact.email = 'joe.bloggs@google.com'
        contact.phone = '123456'
        contact.address_line1 = '16 Pinero Place'
        contact.address_line2 = 'Bucklands Beach'
        contact.message = 'Lawnmowing quote'

        url = server + path
    })

    it('should submit a record', async () => {
        const serverResponse = { success: true }
        let expectedResult = new SubmitFormResult(true, null)
        let actualResult: any

        submitService.submitContactForm(contact)
            .subscribe(res => {
                actualResult = res

            })

        const request = httpMock.expectOne(url)
        expect(request.request.method).toBe('POST')
        expect(request.request.url).toBe(url)
        expect(request.request.body).toEqual(contact)
        request.flush(serverResponse)
        expect(actualResult).toEqual(expectedResult)
    })


    it('should handle error responses', (done) => {
        const status = 500
        const statusText = 'Internal Server Error'
        const errorEvent = new ProgressEvent('Server Error')
        let actualResult = new SubmitFormResult(true, null)

        //submitContactForm catches error and returns const EMPTY
        submitService.submitContactForm(contact)
            .subscribe((res) => {
                actualResult = res
            })

        let request = httpMock.expectOne(url)
        expect(request.request.method).toBe('POST')
        request.error(errorEvent, { status, statusText })
        httpMock.verify()
        expect(actualResult?.outcome).toBeFalse()
        expect(actualResult?.error instanceof HttpErrorResponse).toBeTruthy()
        done()
    })

    afterEach(() => {
        httpMock.verify()
    })
})
