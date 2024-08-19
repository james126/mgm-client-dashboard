import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import { Observable, map, of, catchError } from 'rxjs'
import { environment } from '../../../../../environments/environment'

export interface PasswordStrength {
    valid: boolean;
    suggestions: string[];
}

export interface SignupData {
    username: string;
    email: string;
    password: string;
}

export class SignupResult {
    outcome!: boolean;
    response: HttpErrorResponse | null;

    constructor(outcome: boolean, response: HttpErrorResponse | null) {
        this.outcome = outcome
        this.response = response
    }
}

@Injectable({
    providedIn: 'root',
})
export class SignupService {
    private usernameTakenUrl = ''
    private emailTakenUrl = ''
    private signupUrl = ''
    private recaptchaUrl = ''

    constructor(private http: HttpClient, private logger: NGXLogger) {
        this.usernameTakenUrl = environment.server + environment.usernameTaken
        this.emailTakenUrl = environment.server + environment.emailTaken
        this.signupUrl = environment.server + environment.signUp
        this.recaptchaUrl = environment.recaptchaV3
    }

    public isUsernameTaken(username: string): Observable<boolean | HttpErrorResponse> {
        let params = new HttpParams().set('username', username)
        return this.http.get<{ usernameTaken: boolean }>(this.usernameTakenUrl, { params }).pipe(
            map(result => result.usernameTaken),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    public isEmailTaken(email: string): Observable<boolean | HttpErrorResponse> {
        let params = new HttpParams().set('email', email)
        return this.http.get<{ emailTaken: boolean }>(this.emailTakenUrl, { params }).pipe(
            map(result => result.emailTaken),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    public signup(data: SignupData): Observable<SignupResult> {
        return this.http.post<{ success: true }>(this.signupUrl, data).pipe(
            map(result => new SignupResult(result.success, null)),
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
