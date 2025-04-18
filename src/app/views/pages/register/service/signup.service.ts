import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { NGXLogger } from 'ngx-logger'
import { Observable, map, of, catchError } from 'rxjs'
import { environment } from '../../../../../environments/environment'
import { username } from '../../../../../test/register/dummy-data'

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
    error: HttpErrorResponse | null;

    constructor(outcome: boolean, error: HttpErrorResponse | null) {
        this.outcome = outcome
        this.error = error
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

    constructor(private http: HttpClient, private logger: NGXLogger, private recaptchaV3Service: ReCaptchaV3Service) {
        this.usernameTakenUrl = environment.server + environment.usernameTaken
        this.emailTakenUrl = environment.server + environment.emailTaken
        this.signupUrl = environment.server + environment.signUp
        this.recaptchaUrl = environment.server + environment.recaptcha
    }

    public isUsernameTaken(username: string): Observable<boolean | HttpErrorResponse> {
        const httpOptions = {
            params: {'username': username}
        };

        return this.http.get<{ outcome: boolean }>(this.usernameTakenUrl, httpOptions).pipe(
            map(result => result.outcome),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    public isEmailTaken(email: string): Observable<boolean | HttpErrorResponse> {
        const httpOptions = {
            params: {'email': email}
        };

        return this.http.get<{ outcome: boolean }>(this.emailTakenUrl, httpOptions).pipe(
            map(result => result.outcome),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    public signup(data: SignupData): Observable<SignupResult> {
        return this.http.post<{ outcome: boolean }>(this.signupUrl, data).pipe(
            map(result => new SignupResult(result.outcome, null)),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(new SignupResult(false, err))
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

    public getToken(): Observable<string>{
        return this.recaptchaV3Service.execute('submit');
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
