import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger'
import { catchError, map, Observable, of } from 'rxjs'
import { environment } from '../../../../../environments/environment'

export interface LoginData {
  username: string;
  password: string;
}

export class LoginResult {
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

  constructor(private http: HttpClient, private logger: NGXLogger) {
    this.loginUrl = environment.server + environment.login
    this.recaptchaUrl = environment.recaptchaV3
  }

  public login(data: LoginData): Observable<LoginResult> {
    return this.http.post<{ success: true }>(this.loginUrl, data).pipe(
        map(result => new LoginResult(result.success, null)),
        catchError((err, caught) => {
          this.handleError(err, this.logger)
          return of(err)
        })
    )
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

  private handleError(error: HttpErrorResponse, logger: NGXLogger) {
    this.logger.error(error)
  }
}
