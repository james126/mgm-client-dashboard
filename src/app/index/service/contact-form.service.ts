import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { catchError, EMPTY, map } from "rxjs";
import { environment } from '../../../environments/environment';
import { Contact } from "../dto/contact";

@Injectable()
export class ContactFormService {
	private apiForm = environment.apiForm;
	private apiRecaptcha = environment.apiRecaptcha;

	constructor(private http: HttpClient, private logger: NGXLogger) {
	}

	submitContactForm(body: Contact) {
		return this.http.post(this.apiForm, body, {
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
		return this.http.post(this.apiRecaptcha, token, {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
			observe: 'response',
		}).pipe(map((res) => {
			this.logger.log('Submitted recaptcha ' + res.status);
			if (res.status != 200) {
				throw new Error("Error submitting recaptcha to server with response: " + res.status)
			}
		}), catchError((error: HttpErrorResponse) => {
			this.logger.error(error);
			return EMPTY;
		}))
	}
}
