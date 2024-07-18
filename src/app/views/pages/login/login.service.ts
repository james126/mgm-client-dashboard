import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import { catchError, EMPTY, map } from 'rxjs'
import { environment } from '../../../../environments/environment'

@Injectable()
export class LoginService {
    private apiRecaptcha = environment.recaptcha

    constructor(private http: HttpClient, private logger: NGXLogger) {
    }

    submitRecaptcha(token: String) {
        return this.http.post(this.apiRecaptcha, token, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            observe: 'response',
        }).pipe(map((res) => {
            this.logger.log('Submitted recaptcha ' + res.status)
            if (res.status != 200) {
                throw new Error('Error submitting recaptcha to server with response: ' + res.status)
            }
        }), catchError((error: HttpErrorResponse) => {
            this.logger.error(error)
            return EMPTY
        }))
    }
}
