
import { HttpErrorResponse } from '@angular/common/http'
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core'
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
    ButtonDirective, ButtonCloseDirective, ModalModule, NavLinkDirective,
} from '@coreui/angular'
import _default from 'chart.js/dist/core/core.interaction'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { ControlErrorsComponent } from '../../../utility/control-errors/control-errors.component'
import { map, switchMap, timer, of, Observable, catchError, Subscription, fromEvent, debounceTime } from 'rxjs'
import { PasswordStrength, SignupResult, SignupService } from './service/signup.service'
import { CommonModule } from '@angular/common'
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha'
import { formatErrors } from '../../../utility/format-validation-errors'
import { RouterLink } from '@angular/router'

const { email, maxLength, minLength, pattern, required } = Validators
export const ASYNC_DELAY = 1000
export enum Status{
    Idle = "Idle",
    Success = "Success",
    Error = "Error"
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
        InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ControlErrorsComponent, ReactiveFormsModule, CommonModule,
        RecaptchaModule, ControlErrorsComponent, ButtonCloseDirective, ModalModule, NavLinkDirective, RouterLink, FontAwesomeModule],
    providers: [ReCaptchaV3Service],
})
export class RegisterComponent implements AfterViewInit, OnDestroy{
    @ViewChild('username', { static: true }) usernameInput!: ElementRef
    public usernameValid: boolean | undefined
    @ViewChild('email', { static: true }) emailInput!: ElementRef
    public emailValid: boolean | undefined
    @ViewChild('password', { static: true }) passwordInput!: ElementRef
    public passwordValid: boolean | undefined
    @ViewChild('repeatPassword', { static: true }) repeatPasswordInput!: ElementRef
    public repeatPasswordValid: boolean | undefined

    public username$: Subscription | undefined
    public email$: Subscription | undefined
    public password$: Subscription | undefined
    public repeatPassword$: Subscription | undefined

    public register: FormGroup
    public status: Status
    public show1: boolean
    public show2: boolean
    public modalVisible: boolean;

    readonly faCircleExclamation  = faCircleExclamation
    readonly faCircleCheck  = faCircleCheck

    constructor(private signupService: SignupService, private formBuilder: NonNullableFormBuilder) {
        this.register = this.formBuilder.group({
            username: ['', {
                validators: [required, pattern('[a-zA-Z0-9.]+'), maxLength(20), minLength(5)],
                asyncValidators: [(control: FormControl) => this.validateUsername(control.value)],
                updateOn: 'change',
            }],
            email: ['', {
                validators: [required, email, maxLength(40)],
                asyncValidators: [(control: AbstractControl) => this.validateEmail(control.value)],
                updateOn: 'change',
            }],
            password: ['', {
                validators: [required, maxLength(20), minLength(10)],
                asyncValidators: [(control: AbstractControl) => this.validatePassword(control.value)],
                updateOn: 'change',
            }],
            repeatPassword: ['', {
                validators: [required, maxLength(20), minLength(10)],
                asyncValidators: [(control: AbstractControl) => this.validateRepeatedPassword(control.value)],
                updateOn: 'change',
            }],
        })

        this.show1 = false
        this.show2 = false
        this.status = Status.Idle
        this.modalVisible = false;
    }

    ngAfterViewInit(): void {
        this.username$ = fromEvent(this.usernameInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.usernameInput.nativeElement.value.trim()
                const valid = this.register.controls['username'].errors
                if (value.length == 0) {
                    this.usernameValid = undefined
                } else if (!valid) {
                    this.usernameValid = true
                } else {
                    this.usernameValid = false
                }
            })

        this.password$ = fromEvent(this.passwordInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.passwordInput.nativeElement.value.trim()
                const valid = this.register.controls['password'].valid
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
                const valid = this.register.controls['repeatPassword'].valid
                if (value.length == 0) {
                    this.repeatPasswordValid = undefined
                } else if (valid) {
                    this.repeatPasswordValid = true
                } else {
                    this.repeatPasswordValid = false
                }
            })

        this.email$ = fromEvent(this.emailInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.emailInput.nativeElement.value.trim()
                const valid = this.register.controls['email'].valid
                if (value.length == 0) {
                    this.emailValid = undefined
                } else if (valid) {
                    this.emailValid = true
                } else {
                    this.emailValid = false
                }
            })
    }

    /* No longer used - routes to landing page and then scrolls to a section, section value passed from template */
    // forceNavigate(name: string) {
    //     this.router.navigate(['/landing']);
    //     if (name != ''){
    //         this.fragService.setFragment(name);
    //     }
    // }

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
        return timer(ASYNC_DELAY).pipe(
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

        return timer(ASYNC_DELAY).pipe(
            map((delay) => (pass!.valid && pass!.value === repeatPass)),
            map((valid: boolean) => (valid ? null : { invalid: true })),
        )
    }

    private validateUsername(username: string): ReturnType<AsyncValidatorFn> {
        return timer(ASYNC_DELAY).pipe(
            switchMap((delay) => this.signupService.isUsernameTaken(username)),
            map(res =>
                (res instanceof HttpErrorResponse) ? { serverError: true } : (res ? { taken: true } : null),
            ),
        )
    }

    private validateEmail(email: string): ReturnType<AsyncValidatorFn> {
        return timer(ASYNC_DELAY).pipe(
            switchMap((delay) => this.signupService.isEmailTaken(email)),
            map(res =>
                (res instanceof HttpErrorResponse) ? { serverError: true } : (res ? { taken: true } : null)),
        )
    }

//Cancellation: switchMap has a cancellation effect. It will unsubscribe from the previous inner observable when a new value is emitted by the source observable. map does not have this behavior.
    public onSubmit() {
        if (this.register.valid) {
            timer(ASYNC_DELAY).pipe(
                switchMap((delay: 0) => this.getToken()),
                switchMap((token: string) => this.signupService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) =>
                (score instanceof HttpErrorResponse || score < 0.7) ? of('Error') : this.signupService.signup(this.getFormValues())),
                catchError(() => of("Error"))
            ).subscribe({
                next: (value: string | SignupResult) => {
                    if (value.constructor === SignupResult && value.outcome) {
                        this.status = Status.Success
                    } else {
                        this.status = Status.Error
                    }
                },
                error: () => {
                    this.status = Status.Error
                },
                complete: () => {
                    this.toggleModalVisibility();
                }
            })
        }
    }

    //Method required for testing
    public getToken(): Observable<string>{
        return this.signupService.getToken();
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

    toggleModalVisibility() {
        this.modalVisible = !this.modalVisible;
    }

    /*
    Unused Modal fucnction
    event: true when modal switched from invisible to visible
           false when modal switched from visible to invisible
     */
    handleChange(event: boolean) {
        // if (event){
        //     setTimeout(() => {
        //         this.modalButton?.nativeElement.classList.add('btn-custom');
        //         this.cd.detectChanges();  // Manually trigger change detection if needed
        //     }, 100);  // 100ms delay to ensure transition happens
        // }
    }

    ngOnDestroy(): void {
        this.username$?.unsubscribe();
        this.email$?.unsubscribe();
        this.password$?.unsubscribe();
        this.repeatPassword$?.unsubscribe();
    }
}
