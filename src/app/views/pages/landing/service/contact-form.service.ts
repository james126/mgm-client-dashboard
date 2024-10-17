import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from "@angular/core";
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { NGXLogger } from "ngx-logger";
import { catchError, map, Observable, of } from 'rxjs'
import { environment } from 'src/environments/environment';
import { Contact } from "../dto/contact";

export class SubmitFormResult {
	outcome!: boolean;
	error: HttpErrorResponse | null;

	constructor(outcome: boolean, error: HttpErrorResponse | null) {
		this.outcome = outcome
		this.error = error
	}
}

@Injectable()
export class ContactFormService {
	private recaptchaUrl = '';
	private contactFormUrl = '';

	constructor(private http: HttpClient, private logger: NGXLogger, private recaptchaV3Service: ReCaptchaV3Service) {
		this.contactFormUrl = environment.server + environment.contactForm;
		this.recaptchaUrl = environment.server + environment.recaptchaV3;
	}

	submitContactForm(body: Contact): Observable<SubmitFormResult> {
		return this.http.post<{ success: boolean }>(this.contactFormUrl, body, {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		}).pipe(
			map(result => new SubmitFormResult(result.success, null)),
			catchError((err, caught) => {
				this.handleError(err, this.logger)
				return of(new SubmitFormResult(false, err))
		}))
	}

	submitRecaptcha(token: String): Observable<number | HttpErrorResponse> {
		return this.http.post<{ score: number }>(this.recaptchaUrl, token).pipe(
			map(result => result.score),
			catchError((err, caught) => {
				this.handleError(err, this.logger)
				return of(err)
			})
		)
	}

	public getToken(): Observable<string>{
		return this.recaptchaV3Service.execute('submit');
	}

	private handleError(error: HttpErrorResponse, logger: NGXLogger) {
		this.logger.error(error)
	}
}
