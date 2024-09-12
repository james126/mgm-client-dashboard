
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
    ButtonDirective, ButtonCloseDirective, ModalModule,
} from '@coreui/angular'
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha'
import { catchError, debounceTime, fromEvent, Observable, of, Subscription, switchMap, timer } from 'rxjs'
import { ControlErrorsComponent } from '../register/component/control-errors/control-errors.component'
import { LoginData, LoginResult, LoginService } from './service/login.service'

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
        InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, RouterModule, ReactiveFormsModule, RecaptchaModule, ButtonCloseDirective,
        ModalModule, NgSwitchCase, NgSwitch, ControlErrorsComponent, NgIf],
    providers: [ReCaptchaV3Service],
})
export class LoginComponent implements OnInit, OnDestroy {
    @ViewChild('usernameInput', { static: true }) usernameInput!: ElementRef
    public usernameValid: boolean | undefined
    @ViewChild('passwordInput', { static: true }) passwordInput!: ElementRef
    public passwordValid: boolean | undefined
    @ViewChild('emailInput', { static: true }) emailInput!: ElementRef
    public emailValid: boolean | undefined

    public username$: Subscription | undefined
    public password$: Subscription | undefined
    public email$: Subscription | undefined
    public loginModalVisible: boolean;
    public resetPassModalVisible: boolean;
    public feedbackModuleVisible: boolean
    public login: FormGroup
    public resetPassword: FormGroup
    public loginStatus: Status
    public resetPassStatus: Status
    public show1: boolean

    constructor(private loginService: LoginService, private formBuilder: NonNullableFormBuilder, private recaptchaV3Service: ReCaptchaV3Service) {
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

        this.resetPassword = this.formBuilder.group({
            email: ['', {
                validators: [required],
                updateOn: 'change',
            }]
        })

        this.show1 = false
        this.loginStatus = Status.Idle
        this.resetPassStatus = Status.Idle
        this.usernameValid = undefined
        this.passwordValid = undefined
        this.emailValid = undefined
        this.username$ = undefined;
        this.password$ = undefined;
        this.email$ = undefined;
        this.loginModalVisible = false;
        this.resetPassModalVisible = false;
        this.feedbackModuleVisible = false;
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

        this.email$ = fromEvent(this.emailInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.emailInput.nativeElement.value.trim()
                let regex = new RegExp('\\S+[@]\\S+[.]\\S+')
                let valid = regex.test(value)
                if (value.length == 0) {
                    this.emailValid = undefined
                } else if (valid) {
                    this.emailValid = true
                } else {
                    this.emailValid = false
                }
            })
    }

    public onSubmit() {
        if (this.login.valid && this.loginService.validateInputLengths(this.login.get('username')!.value, this.login.get('password')!.value)) {
            timer(ASYNC_DELAY).pipe(
                switchMap(() => this.getToken()),
                switchMap((token: string) => this.loginService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) =>
                    (score instanceof HttpErrorResponse || score < 0.7) ? of('Error') : this.loginService.login(this.getFormValues())),
                catchError(() => of('Error')),
            ).subscribe({
                next: (value: string | LoginResult) => {
                    if (value.constructor === LoginResult) {
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
                        this.toggleLoginModalVisibility();
                    }
                },
            })
        } else {
            this.loginStatus = Status.Invalid
            this.toggleLoginModalVisibility();
        }
    }

    public forgotPass() {
        this.resetPassword.get('email')?.reset();
        this.toggleResetPassModalVisibility()
    }

    get username() {
        return this.login.get('username')
    }

    get password() {
        return this.login.get('password')
    }



//Method required for testing
    public getToken(): Observable<string> {
        return this.recaptchaV3Service.execute('submit')
    }

    public togglePass() {
        this.show1 = !this.show1
    }

    private getFormValues() {
        let data: LoginData = {
            username: this.login.get('username')!.value,
            password: this.login.get('password')!.value,
        }
        return data
    }

    toggleLoginModalVisibility() {
        this.loginModalVisible = !this.loginModalVisible;
    }

    toggleResetPassModalVisibility() {
        this.resetPassModalVisible = !this.resetPassModalVisible;
    }

    toggleFeedbackModalVisibility() {
        this.feedbackModuleVisible = !this.feedbackModuleVisible;
    }

    /*
     Unused Modal fucnction
     Required for c-modal element
     event: true when modal switched from invisible to visible
     false when modal switched from visible to invisible
     */
    handleLoginChange(event: boolean) {
        //this.loginModalVisible=event;
    }

    handleResetPassChange(event: boolean) {
        //this.loginModalVisible=event;
    }

    handleFeedbackChange(event: boolean) {
        //this.loginModalVisible=event;
    }

    ngOnDestroy(): void {
        this.username$?.unsubscribe();
        this.password$?.unsubscribe();
        this.email$?.unsubscribe();
    }
}
