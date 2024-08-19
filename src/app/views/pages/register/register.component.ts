import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnDestroy } from '@angular/core'
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { IconDirective } from '@coreui/icons-angular'
import {
    ContainerComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    ButtonDirective,
} from '@coreui/angular'
import _default from 'chart.js/dist/core/core.interaction'
import { ControlErrorsComponent } from './components/control-errors.component'
import { map, switchMap, timer, of, Observable, catchError, Subscription } from 'rxjs'
import { PasswordStrength, SignupResult, SignupService } from './services/signup.service'
import { CommonModule } from '@angular/common'
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faEye, faEyeSlash, IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { formatErrors } from './util/format-validation-errors'

const { email, maxLength, minLength, pattern, required } = Validators
export const VALIDATION_DELAY = 1000
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
        InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ControlErrorsComponent, ReactiveFormsModule, CommonModule,
        RecaptchaModule, ControlErrorsComponent, FontAwesomeModule],
    providers: [ReCaptchaV3Service],
})
export class RegisterComponent implements OnDestroy{
    public register: FormGroup
    public status: String
    public faEye: IconDefinition
    public faEyeSlash: IconDefinition
    public show1: boolean
    public show2: boolean
    public submit: Subscription

    constructor(private signupService: SignupService, private formBuilder: NonNullableFormBuilder, private recaptchaV3Service: ReCaptchaV3Service) {
        this.register = this.formBuilder.group({
            username: ['', {
                validators: [required, pattern('[a-zA-Z0-9.]+'), maxLength(20), minLength(5)],
                asyncValidators: [(control: FormControl) => this.validateUsername(control.value)],
                updateOn: 'blur',
            }],
            email: ['', {
                validators: [required, email, maxLength(40)],
                asyncValidators: [(control: AbstractControl) => this.validateEmail(control.value)],
                updateOn: 'blur',
            }],
            password: ['', {
                validators: [required, maxLength(20), minLength(10)],
                asyncValidators: [(control: AbstractControl) => this.validatePassword(control.value)],
                updateOn: 'blur',
            }],
            repeatPassword: ['', {
                validators: [required, maxLength(20), minLength(10)],
                asyncValidators: [(control: AbstractControl) => this.validateRepeatedPassword(control.value)],
                updateOn: 'blur',
            }],
        })

        this.faEye = faEye
        this.faEyeSlash = faEyeSlash
        this.show1 = false
        this.show2 = false
        this.status = 'idle'
        this.submit = new Subscription();
    }

    public togglePass(field: String) {
        switch (field) {
            case 'pass1':
                this.show1 = !this.show1
                break
            case 'pass2':
                this.show2 = !this.show2
                break
        }
    }

    private validatePassword(password: string): ReturnType<AsyncValidatorFn> {
        return timer(VALIDATION_DELAY).pipe(
            switchMap((delay) => this.signupService.getPasswordStrength(password)),
            map((value: PasswordStrength) => (value.valid ? null : formatErrors(value.suggestions))))
    }

    /*
     In Angular, AsyncValidatorFn is a type representing a function used for asynchronous validation in reactive forms.
     It is a function that returns either an Observable that emits a validation error or null if there are no errors.
     The ReturnType<AsyncValidatorFn> utility type in TypeScript extracts the return type of the AsyncValidatorFn type,
     which is Observable<ValidationErrors | null>.
     */
    private validateRepeatedPassword(repeatPass: any): ReturnType<AsyncValidatorFn> {
        if (this.register.get('password') == undefined) {
            return of(null)
        }
        const pass = this.register.get('password')

        return timer(VALIDATION_DELAY).pipe(
            map((delay) => (pass!.valid && pass!.value === repeatPass)),
            map((valid: boolean) => (valid ? null : { invalid: true })),
        )
    }

    private validateUsername(username: string): ReturnType<AsyncValidatorFn> {
        return timer(VALIDATION_DELAY).pipe(
            switchMap((delay) => this.signupService.isUsernameTaken(username)),
            map(res =>
                (res instanceof HttpErrorResponse) ? { serverError: true } : (res ? { taken: true } : null),
            ),
        )
    }

    private validateEmail(email: string): ReturnType<AsyncValidatorFn> {
        return timer(VALIDATION_DELAY).pipe(
            switchMap((delay) => this.signupService.isEmailTaken(email)),
            map(res =>
                (res instanceof HttpErrorResponse) ? { serverError: true } : (res ? { taken: true } : null)),
        )
    }

    /**
     * Gets all form control values except repeatPassword
     * @private
     */
    private getFormValues() {
        let obj = { username: '', password: '', email: '' }
        obj.username = this.register.get('username')!.value
        obj.password = this.register.get('password')!.value
        obj.email = this.register.get('email')!.value
        return obj
    }

//Cancellation: switchMap has a cancellation effect. It will unsubscribe from the previous inner observable when a new value is emitted by the source observable. map does not have this behavior.
    public onSubmit() {
        if (this.register.valid) {
            this.submit = timer(VALIDATION_DELAY).pipe(
                switchMap((delay: 0) => this.getToken()),
                switchMap((token: string) => this.signupService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) => {
                    if (score instanceof HttpErrorResponse) {
                        return 'error'
                    } else if (score < 0.7) {
                        return 'error'
                    } else {
                        return this.signupService.signup(this.getFormValues())
                    }
                }),
                catchError(() => of("error"))
            ).subscribe({
                next: (value: string | SignupResult) => {
                    if (value.constructor === SignupResult) {
                        if (value.outcome) {
                            this.status = 'success'
                        } else {
                            this.status = 'error'
                        }
                    } else {
                        this.status = 'error'
                    }
                }
            })
        }
    }

    public getToken(): Observable<string>{
        return this.recaptchaV3Service.execute('submit');
    }

    ngOnDestroy(): void {
        this.submit.unsubscribe();
    }
}
