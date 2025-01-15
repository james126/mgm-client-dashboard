import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { NGXLogger } from 'ngx-logger'
import { catchError, map, Observable, of } from 'rxjs'
import { environment } from '../../../../../environments/environment'

export interface LoginData {
    username: string;
    password: string;
}

export interface PasswordStrength {
    valid: boolean;
    suggestions: string[];
}

export class Result {
    outcome!: boolean
    error: HttpErrorResponse | null
    temporaryPassword!: boolean

    constructor(outcome: boolean, error: HttpErrorResponse | null, temporaryPassword: boolean) {
        this.outcome = outcome
        this.error = error
        this.temporaryPassword = temporaryPassword
    }
}

@Injectable()
export class LoginService {
    private loginUrl = ''
    private recaptchaUrl = ''
    private forgotPassEmail = ''
    private newPassUrl = ''

    constructor(private http: HttpClient, private logger: NGXLogger, private recaptchaV3Service: ReCaptchaV3Service) {
        this.loginUrl = environment.server + environment.login
        this.recaptchaUrl = environment.server + environment.recaptcha
        this.forgotPassEmail = environment.server + environment.forgotPassEmail
        this.newPassUrl = environment.server + environment.newPass
    }

    public login(data: LoginData): Observable<Result | any> {
        return this.http.post<Result>(this.loginUrl, data, {
            observe: 'response',
            withCredentials: true
        }).pipe(
            map(result => new Result(result.body?.outcome ? result.body.outcome : false, null, result.body?.temporaryPassword ? result.body.temporaryPassword : false)),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    public getToken(): Observable<string> {
        return this.recaptchaV3Service.execute('submit')
    }

    submitRecaptcha(token: string): Observable<number | HttpErrorResponse> {
        return this.http.post<{ score: number }>(this.recaptchaUrl, token).pipe(
            map(result => result.score),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    /*
    Submits an email address
    If the email matches an existing account true is returned, otherwise false
     */
    forgotPassCheck(email: string): Observable<any> {
        return this.http.post<Result>(this.forgotPassEmail, email, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }).pipe(
            map(result => new Result(result.outcome, result.error, result.temporaryPassword)),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    newPass(newPass: string, username: string): Observable<any> {
        let data: LoginData = {
            username: username,
            password: newPass,
        }

        return this.http.post<Result>(this.newPassUrl, data, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }).pipe(
            map(result => new Result(result.outcome, result.error, result.temporaryPassword)),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    private handleError(error: HttpErrorResponse, logger: NGXLogger) {
        this.logger.error(error)
    }

    validateLoginInput(username: string, password: string): boolean {
        const strength: PasswordStrength = {
            valid: false,
            suggestions: [],
        }

        const upperCase = this.hasUpperCase(password, strength)
        const lowerCase = this.hasLowerCase(password, strength)
        const numeric = this.hasNumeric(password, strength)
        const specialChar = this.hasSpecialChar(password, strength)
        strength.valid = upperCase && lowerCase && numeric && specialChar

        return (username?.length >= 5)
            && (username?.length <= 20)
            && (password?.length >= 10)
            && (password?.length <= 20)
            && strength.valid
    }

    public getPasswordStrength(value: string): Observable<PasswordStrength> {
        const strength: PasswordStrength = {
            valid: false,
            suggestions: [],
        }

        if (!value) {
            strength.suggestions.push('invalidPassword')
            return of(strength)
        }

        const upperCase = this.hasUpperCase(value, strength)
        const lowerCase = this.hasLowerCase(value, strength)
        const numeric = this.hasNumeric(value, strength)
        const specialChar = this.hasSpecialChar(value, strength)
        strength.valid = upperCase && lowerCase && numeric && specialChar

        return of(strength)
    }

    private hasUpperCase(value: string, strength: PasswordStrength): boolean {
        const hasUpperCase = /[A-Z]+/.test(value)
        hasUpperCase ? null : strength.suggestions.push('requiresUppercase')
        return hasUpperCase
    }

    private hasLowerCase(value: string, strength: PasswordStrength): boolean {
        const hasLowerCase = /[a-z]+/.test(value)
        hasLowerCase ? null : strength.suggestions.push('requiresLowercase')
        return hasLowerCase
    }

    private hasNumeric(value: string, strength: PasswordStrength): boolean {
        const hasNumeric = /[0-9]+/.test(value)
        hasNumeric ? null : strength.suggestions.push('requiresNumeric')
        return hasNumeric
    }

    private hasSpecialChar(value: string, strength: PasswordStrength): boolean {
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-=\[\];'"\?/]+/.test(value)
        hasSpecialChar ? null : strength.suggestions.push('requiresSpecial')
        return hasSpecialChar
    }
}
