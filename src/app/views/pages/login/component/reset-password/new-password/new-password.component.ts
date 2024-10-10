import { HttpErrorResponse } from '@angular/common/http'
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core'
import { AbstractControl, AsyncValidatorFn, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import {
    AlertComponent,
    ButtonCloseDirective,
    ButtonDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective,
} from '@coreui/angular'
import { IconDirective } from '@coreui/icons-angular'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { catchError, debounceTime, fromEvent, map, Observable, of, Subscription, switchMap, timer } from 'rxjs'
import { PasswordStrength } from '../../../../register/service/signup.service'
import { formatErrors } from '../../../../register/util/format-validation-errors'
import { LoginService, Result } from '../../../service/login.service'

const { maxLength, minLength, required } = Validators

export const ASYNC_DELAY = 1000

export enum PasswordStatus {
    Idle = 'Idle',
    Success = 'Success',
    Invalid = 'Invalid',
    Error = 'Error'
}

@Component({
    selector: 'new-password',
    standalone: true,
    imports: [
        AlertComponent,
        ButtonCloseDirective,
        ButtonDirective,
        FaIconComponent,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ReactiveFormsModule,
        IconDirective,
    ],
    templateUrl: './new-password.component.html',
    styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent implements AfterViewInit, OnDestroy {
    @Input() visible: boolean
    public internalVisible: boolean
    @Output() changeVisible: EventEmitter<boolean> = new EventEmitter()

    @ViewChild('password', { static: true }) passwordInput!: ElementRef
    public passwordValid: boolean | undefined
    @ViewChild('repeatPassword', { static: true }) repeatPasswordInput!: ElementRef
    public repeatPasswordValid: boolean | undefined
    public password$: Subscription | undefined
    public repeatPassword$: Subscription | undefined

    public form: FormGroup
    public show3: boolean
    public show4: boolean
    public status: PasswordStatus
    readonly faLock = faLock

    constructor(private formBuilder: NonNullableFormBuilder, private loginService: LoginService) {
        this.form = this.formBuilder.group({
            newPass: ['', {
                validators: [required, maxLength(20), minLength(10)],
                asyncValidators: [(control: AbstractControl) => this.validatePassword(control.value)],
                updateOn: 'change',
            }],
            repeatNewPass: ['', {
                validators: [required, maxLength(20), minLength(10)],
                asyncValidators: [(control: AbstractControl) => this.validateRepeatedPassword(control.value)],
                updateOn: 'change',
            }],
        })

        this.visible = false
        this.internalVisible = false
        this.status = PasswordStatus.Idle
        this.show3 = false
        this.show4 = false
    }

    ngAfterViewInit(): void {
        this.password$ = fromEvent(this.passwordInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.passwordInput.nativeElement.value.trim()
                const valid = this.form.controls['newPass'].valid
                if (value.length == 0) {
                    this.passwordValid = undefined
                } else if (valid) {
                    this.passwordValid = true
                } else {
                    this.passwordValid = false
                }
            })

        this.repeatPassword$ = fromEvent(this.repeatPasswordInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.repeatPasswordInput.nativeElement.value.trim()
                const valid = this.form.controls['repeatNewPass'].valid
                if (value.length == 0) {
                    this.repeatPasswordValid = undefined
                } else if (valid) {
                    this.repeatPasswordValid = true
                } else {
                    this.repeatPasswordValid = false
                }
            })
    }

    public onSubmit() {
        if (this.form.valid) {
            timer(ASYNC_DELAY).pipe(
                switchMap(() => this.getToken()),
                switchMap((token: string) => this.loginService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) => this.loginService.newPass(this.form.get('newPass')?.value)),
                catchError(() => of('Error')),
            ).subscribe({
                next: (value: string | Result) => {
                    if (value.constructor === Result) {
                        this.status = PasswordStatus.Success
                    } else {
                        this.status = PasswordStatus.Error
                    }
                },
                error: () => {
                    this.status = PasswordStatus.Error
                },
            })
        } else {
            this.status = PasswordStatus.Error
        }
    }

    private validatePassword(password: string): ReturnType<AsyncValidatorFn> {
        return timer(ASYNC_DELAY).pipe(
            switchMap((delay) => this.loginService.getPasswordStrength(password)),
            map((value: PasswordStrength) => (value.valid ? null : formatErrors(value.suggestions))))
    }

    private validateRepeatedPassword(repeatPass: any): ReturnType<AsyncValidatorFn> {
        if (this.form.get('newPass') == undefined) {
            return of(null)
        }
        const pass = this.form.get('newPass')

        return timer(ASYNC_DELAY).pipe(
            map((delay) => (pass!.valid && pass!.value === repeatPass)),
            map((valid: boolean) => (valid ? null : { invalid: true })),
        )
    }

    public isVisible() {
        if (this.visible == false) {
            if (this.internalVisible) {
                this.form.get('newPass')?.reset()
                this.form.get('repeatNewPassword')?.reset()
                this.status = PasswordStatus.Idle
                this.internalVisible = false
            }
            return false
        } else {
            if (!this.internalVisible) {
                this.form.get('newPass')?.reset()
                this.form.get('repeatNewPassword')?.reset()
                this.status = PasswordStatus.Idle
                this.internalVisible = true
            }
            return true
        }
    }

    hideFeedback() {
        this.internalVisible = false
        this.changeVisible.emit(false)
    }

    public getToken(): Observable<string> {
        return this.loginService.getToken()
    }

    public getStatus(): string {
        return this.status
    }

    handleChange(event: boolean) {
        this.form.get('password')?.reset()
        this.form.get('repeatPassword')?.reset()
        this.status = PasswordStatus.Idle
        this.passwordValid = undefined
        this.repeatPasswordValid = undefined
    }

    public togglePass(field: String) {
        switch (field) {
            case 'pass3':
                this.show3 = !this.show3
                break
            case 'pass4':
                this.show4 = !this.show4
                break
        }
    }

    ngOnDestroy(): void {
        this.password$?.unsubscribe()
        this.repeatPassword$?.unsubscribe()
    }
}
