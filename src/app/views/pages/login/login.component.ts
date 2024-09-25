
import { HttpErrorResponse } from '@angular/common/http'
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { IconDirective } from '@coreui/icons-angular'
import {
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    ButtonDirective, ButtonCloseDirective, ModalModule, GutterDirective,
} from '@coreui/angular'
import { catchError, debounceTime, fromEvent, Observable, of, Subscription, switchMap, timer } from 'rxjs'
import { LoginFeedbackComponent } from './component/login-feedback/login-feedback.component'
import { ResetPasswordComponent } from './component/reset-password/reset-password.component'
import { LoginData, Result, LoginService } from './service/login.service'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { AlertComponent } from '@coreui/angular';

const { required } = Validators
export const ASYNC_DELAY = 1000

export enum Status {
    Idle = 'Idle',
    Success = 'Success',
    Invalid = 'Invalid',
    Error = 'Error'
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
        InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, RouterModule, ReactiveFormsModule, ButtonCloseDirective,
        ModalModule, NgSwitchCase, NgSwitch, NgIf, FontAwesomeModule, AlertComponent, GutterDirective, LoginFeedbackComponent, ResetPasswordComponent],
    providers: [],
})
export class LoginComponent implements OnInit, OnDestroy {
    @ViewChild('usernameInput', { static: true }) usernameInput!: ElementRef
    public usernameValid: boolean | undefined
    @ViewChild('passwordInput', { static: true }) passwordInput!: ElementRef
    public passwordValid: boolean | undefined

    public username$: Subscription | undefined
    public password$: Subscription | undefined
    public login: FormGroup
    public loginStatus: Status
    public togglePassword: boolean
    public icons: IconDefinition[] = []

    public loginFeedbackVisible: boolean;
    public resetPassVisible: boolean;

    constructor(private loginService: LoginService, private formBuilder: NonNullableFormBuilder) {
        this.login = this.formBuilder.group({
            username: ['', {
                validators: [required],
                updateOn: 'change',
            }],
            password: ['', {
                validators: [required],
                updateOn: 'change',
            }],
        })

        this.username$ = undefined;
        this.password$ = undefined;
        this.usernameValid = undefined
        this.passwordValid = undefined

        this.loginStatus = Status.Idle

        this.togglePassword = false
        this.loginFeedbackVisible = false;
        this.resetPassVisible = false;
        this.icons.push()
    }

    ngOnInit(): void {
        this.username$ = fromEvent(this.usernameInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.usernameInput.nativeElement.value.trim()
                if (value.length > 0) {
                    this.usernameValid = undefined
                } else {
                    this.usernameValid = false
                }
            })

        this.password$ = fromEvent(this.passwordInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.passwordInput.nativeElement.value.trim()
                if (value.length > 0) {
                    this.passwordValid = undefined
                } else {
                    this.passwordValid = false
                }
            })
    }

    public onSubmit() {
        if (this.login.valid && this.loginService.validateLoginInput(this.login.get('username')!.value, this.login.get('password')!.value)) {
            timer(ASYNC_DELAY).pipe(
                switchMap(() => this.getToken()),
                switchMap((token: string) => this.loginService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) =>
                    (score instanceof HttpErrorResponse || score < 0.7) ? of('Error') : this.loginService.login(this.getFormValues())),
                catchError(() => of('Error')),
            ).subscribe({
                next: (value: string | Result) => {
                    if (value.constructor === Result) {
                        this.loginStatus = value.outcome ? Status.Success : Status.Invalid
                    } else {
                        this.loginStatus = Status.Error
                    }
                },
                error: () => {
                    this.loginStatus = Status.Error
                },
                complete: () => {
                    if (this.loginStatus !== Status.Success) {
                        this.showLoginFeedbackModal(true);
                    }
                },
            })
        } else {
            this.loginStatus = Status.Invalid
            this.showLoginFeedbackModal(true);
        }
    }

    public forgotPass() {
        this.showResetPassModal(true)
    }

    public getToken(): Observable<string> {
        return this.loginService.getToken()
    }

    showLoginFeedbackModal(visible: boolean) {
        this.loginFeedbackVisible = visible;
        if (!visible){
            this.loginStatus = Status.Idle;
        }
    }

    showResetPassModal(visible: boolean) {
        this.resetPassVisible = visible;
    }

    private getFormValues() {
        let data: LoginData = {
            username: this.login.get('username')!.value,
            password: this.login.get('password')!.value,
        }
        return data
    }

    public togglePass() {
        this.togglePassword = !this.togglePassword
    }

    get username() {
        return this.login.get('username')
    }

    get password() {
        return this.login.get('password')
    }

    ngOnDestroy(): void {
        this.username$?.unsubscribe();
        this.password$?.unsubscribe();
    }
}
