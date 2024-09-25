import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { NGXLogger } from 'ngx-logger'
import { catchError, map, Observable, of } from 'rxjs'
import { environment } from '../../../../../environments/environment'

export interface LoginData {
  username: string;
  password: string;
}

export class Result {
  outcome!: boolean;
  error: HttpErrorResponse | null;

  constructor(outcome: boolean, error: HttpErrorResponse | null) {
    this.outcome = outcome
    this.error = error
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = ''
  private recaptchaUrl = ''
  private forgotPassEmail = ''

  constructor(private http: HttpClient, private logger: NGXLogger, private recaptchaV3Service: ReCaptchaV3Service) {
    this.loginUrl = environment.server + environment.login
    this.recaptchaUrl = environment.server + environment.recaptcha
    this.forgotPassEmail = environment.server + environment.forgotPassEmail
  }

  public login(data: LoginData): Observable<Result | any> {
    return this.http.post<Result>(this.loginUrl, data).pipe(
        catchError((err, caught) => {
          this.handleError(err, this.logger)
          return of(err)
        })
    )
  }

    public getToken(): Observable<string>{
        return this.recaptchaV3Service.execute('submit');
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

  forgotPassCheck(email: String): Observable<any> {
    return this.http.post<Result>(this.forgotPassEmail, email).pipe(
        catchError((err, caught) => {
            this.handleError(err, this.logger)
            return of(err)
        })
    )
  }

  private handleError(error: HttpErrorResponse, logger: NGXLogger) {
    this.logger.error(error)
  }

  validateLoginInput(username: string, password: string): boolean {
          return (username.length >= 5)
              && (username.length <= 20)
              && (password.length >= 10)
              && (password.length <= 20)
  }
}
