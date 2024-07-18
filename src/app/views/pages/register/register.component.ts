import { Component, OnInit } from '@angular/core'
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
import { ControlErrorsComponent } from './components/control-errors/control-errors.component'
import { map, switchMap, timer, of } from 'rxjs'
import { PasswordStrength, SignupService } from './services/signup.service'
import { CommonModule } from '@angular/common'

const { email, maxLength, minLength, pattern, required } = Validators

/**
 * Wait before sending requests to the server
 */
const VALIDATION_DELAY = 1000

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective,
        IconDirective, FormControlDirective, ButtonDirective, ControlErrorsComponent, ReactiveFormsModule, CommonModule, ControlErrorsComponent],
})
export class RegisterComponent implements OnInit {
    public showPassword = false
    public register: FormGroup
    public submitProgress: 'idle' | 'success' | 'error' = 'idle'

    constructor(private signupService: SignupService, private formBuilder: NonNullableFormBuilder) {
        this.register = this.formBuilder.group({
            username: [
                '',
                [required, pattern('[a-zA-Z0-9.]+'), maxLength(30), minLength(5)],
                (control: FormControl) => this.validateUsername(control.value),
            ],
            email: [
                '',
                [required, email, maxLength(50)],
                (control: AbstractControl) => this.validateEmail(control.value),
            ],
            password: ['',
                [required, maxLength(50), minLength(10)],
                (control: AbstractControl) => this.validatePassword(control.value)],
            repeatedPassword: ['',
                [required, maxLength(50), minLength(10)],
                (control: AbstractControl) => this.validateRepeatedPassword(control.value)],
        })
    }

    ngOnInit(): void {
    }

    private validatePassword(password: string): ReturnType<AsyncValidatorFn> {
        return timer(VALIDATION_DELAY).pipe(
            switchMap(() => of(this.signupService.getPasswordStrength(password),
                map((value: PasswordStrength) => (value.valid ? null : { valid: true })))))
    }

    /*
     In Angular, AsyncValidatorFn is a type representing a function used for asynchronous validation in reactive forms.
     It is a function that returns either an Observable that emits a validation error or null if there are no errors.
     The ReturnType<AsyncValidatorFn> utility type in TypeScript extracts the return type of the AsyncValidatorFn type,
     which is Observable<ValidationErrors | null>.
     */
    private validateRepeatedPassword(repeatedPass: any): ReturnType<AsyncValidatorFn> {
        if ((!this.register.get('password')?.dirty) || (this.register.get('password') != repeatedPass)) {
            return of({ repatedPasswordValid: false })
        }

        return of(null)
    }

    private validateUsername(username: string): ReturnType<AsyncValidatorFn> {
        return timer(VALIDATION_DELAY).pipe(
            map(() => this.signupService.isUsernameTaken(username)),
            map((taken) => (taken ? { taken: true } : null)),
        )
    }

    private validateEmail(email: string): ReturnType<AsyncValidatorFn> {
        return timer(VALIDATION_DELAY).pipe(
            map( x => this.signupService.isEmailTaken(email)),
            map((taken) => (taken ? { taken: true } : null)),
        )
    }

    onSubmit(): void {
        if (!this.register.valid) return
        timer(VALIDATION_DELAY).subscribe(
            () => {
                let data = this.register.getRawValue();
                delete data.repeatedPassword;
                this.signupService.signup(data.subscribe({
                    complete: () => {
                        this.submitProgress = 'success'
                    },
                    error: () => {
                        this.submitProgress = 'error'
                    },
                }))
            },
        )
    }
}
