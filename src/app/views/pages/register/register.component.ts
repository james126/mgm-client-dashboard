import { Component, ElementRef } from '@angular/core'
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms'
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
import { ControlErrorsComponent } from './components/control-errors.component'
import { map, switchMap, timer, of } from 'rxjs'
import { PasswordStrength, SignupService } from './services/signup.service'
import { CommonModule } from '@angular/common'

const { email, maxLength, minLength, pattern, required } = Validators
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faEye, faEyeSlash, IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { formatErrors } from './util/format-validation-errors'

/**
 * Wait before sending requests to the server
 */
export const VALIDATION_DELAY = 1000

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
        InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ControlErrorsComponent, ReactiveFormsModule, CommonModule,
        ControlErrorsComponent, FontAwesomeModule],
})
export class RegisterComponent {
    public register: FormGroup
    public status: 'idle' | 'success' | 'error' = 'idle'
    public faEye: IconDefinition
    public faEyeSlash: IconDefinition
    public show1: boolean
    public show2: boolean

    constructor(private signupService: SignupService, private formBuilder: NonNullableFormBuilder) {
        this.register = this.formBuilder.group({
            username: ['', {
                validators:  [required, pattern('[a-zA-Z0-9.]+'), maxLength(20), minLength(5)],
                asyncValidators: [(control: FormControl) => this.validateUsername(control.value)],
                updateOn: 'blur'
            }],
            email: [ '', {
                validators: [required, email, maxLength(40)],
                asyncValidators: [(control: AbstractControl) => this.validateEmail(control.value)],
                updateOn: 'blur'
            }],
            password: ['', {
                validators: [required, maxLength(20), minLength(10)],
                asyncValidators: [(control: AbstractControl) => this.validatePassword(control.value)],
                updateOn: 'blur'
            }],
            repeatPassword: ['', {
                validators: [required, maxLength(20), minLength(10)],
                asyncValidators: [(control: AbstractControl) => this.validateRepeatedPassword(control.value)],
                updateOn: 'blur'
            }],
        })

        this.faEye = faEye
        this.faEyeSlash = faEyeSlash
        this.show1 = false
        this.show2 = false
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
        if (this.register.get('password') == undefined){
            return of(null);
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
            map((usernameTaken) => (usernameTaken ? { taken: true } : null)),
        )
    }

    private validateEmail(email: string): ReturnType<AsyncValidatorFn> {
        return timer(VALIDATION_DELAY).pipe(
            switchMap((delay) => this.signupService.isEmailTaken(email)),
            map((emailTaken) => (emailTaken ? { taken: true } : null)),
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

    onSubmit(): void {
        if (!this.register.valid) return
        timer(VALIDATION_DELAY).subscribe(
            () => {
                this.signupService.signup(this.getFormValues()).subscribe({
                    next: (res) => {
                        this.status = res.success ? 'success' : 'error'
                    },
                    error: () => {
                        this.status = 'error'
                    },
                })
            },
        )
    }
}
