import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from '@angular/core/testing';
import { NGXLogger } from "ngx-logger";
import { NGXLoggerMock } from "ngx-logger/testing";
import { environment } from "../../environments/environment";
import { Contact } from "../../app/index/dto/contact";
import { ContactFormService } from '../../app/index/service/contact-form.service';
import { isEmpty } from "rxjs";


xdescribe('ContactFormService', () => {
	let submitService: ContactFormService;
	let httpMock: HttpTestingController;
	let url = environment.apiForm;
	let contact: Contact

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [ContactFormService, { provide: NGXLogger, useClass: NGXLoggerMock },]
		});

		submitService = TestBed.inject(ContactFormService);
		httpMock = TestBed.inject(HttpTestingController);

		contact = new Contact();
		contact.first_name = 'Joe';
		contact.last_name = 'Bloggs';
		contact.email = 'joe.bloggs@google.com';
		contact.phone = '123456';
		contact.address_line1 = '16 Pinero Place';
		contact.address_line2 = 'Bucklands Beach'
		contact.message = 'Lawnmowing quote'
	})


	it('should submit a record', async () => {
		submitService.submitContactForm(contact)
			.subscribe(
				res => {
					expect(res).toBeUndefined();
					//submitContactForm returns Observable<void>
				}
			)

		const request = httpMock.expectOne(url);
		expect(request.request.method).toBe('POST');
		expect(request.request.url).toBe('http://localhost:8080/api/form');
		expect(request.request.body).toEqual(contact);
		request.flush({ body: contact });
	});


	it('should handle error responses', (done) => {
		//submitContactForm catches error and returns const EMPTY
		submitService.submitContactForm(contact)
			.pipe(isEmpty()).subscribe((res) => {
				expect(res).toEqual(true);
				done();
			});

		let request = httpMock.expectOne(url);
		expect(request.request.method).toBe('POST');

		const data = 'Invalid request parameters';
		const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
		request.flush(data, mockErrorResponse);
	});

	afterEach(() => {
		httpMock.verify();
	});
});