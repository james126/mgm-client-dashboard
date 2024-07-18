import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { NGXLogger } from "ngx-logger";
import { catchError, EMPTY, map } from "rxjs";
import { environment } from 'src/environments/environment';
import { Contact } from "../dto/contact";

@Injectable()
export class ContactFormService {
	private recaptchaUrl = '';
	private contactFormUrl = '';

	constructor(private http: HttpClient, private logger: NGXLogger) {
		this.contactFormUrl = environment.server + environment.contactForm;
		this.recaptchaUrl = environment.server + environment.recaptcha;
	}

	submitContactForm(body: Contact) {
		return this.http.post(this.contactFormUrl, body, {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
			observe: 'response',
		}).pipe(map((res) => {
			this.logger.log('Submitted contact.ts form ' + res.status);
		}), catchError((error: HttpErrorResponse) => {
			this.logger.error(error);
			return EMPTY;
		}))
	}

	submitRecaptcha(token: String) {
		return this.http.post(this.recaptchaUrl, token, {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
			observe: 'response',
		})
	}

	error(error: HttpErrorResponse) {
		this.logger.error(error);
	}
}
