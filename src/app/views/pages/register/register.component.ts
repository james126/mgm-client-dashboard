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
    ButtonDirective, ButtonCloseDirective, ModalModule, NavLinkDirective,
} from '@coreui/angular'
import _default from 'chart.js/dist/core/core.interaction'
import { LandingFragmentService } from '../landing/service/fragment.service'
import { ControlErrorsComponent } from './components/control-errors/control-errors.component'
import { map, switchMap, timer, of, Observable, Subscription, catchError } from 'rxjs'
import { PasswordStrength, SignupResult, SignupService } from './services/signup.service'
import { CommonModule } from '@angular/common'
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faEye, faEyeSlash, IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { formatErrors } from './util/format-validation-errors'
import { Router, RouterLink } from '@angular/router'

const { email, maxLength, minLength, pattern, required } = Validators
export const VALIDATION_DELAY = 1000

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
        InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ControlErrorsComponent, ReactiveFormsModule, CommonModule,
        RecaptchaModule, ControlErrorsComponent, FontAwesomeModule, ButtonCloseDirective, ModalModule, NavLinkDirective, RouterLink],
    providers: [ReCaptchaV3Service],
})
export class RegisterComponent{
    public register: FormGroup
    public status: Map<string, boolean>
    public faEye: IconDefinition
    public faEyeSlash: IconDefinition
    public show1: boolean
    public show2: boolean
    public visible: boolean;

    constructor(private signupService: SignupService, private formBuilder: NonNullableFormBuilder, private recaptchaV3Service: ReCaptchaV3Service,
        public router: Router, private fragService: LandingFragmentService) {
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
        this.status = new Map<string, boolean>([["Idle", true],["Success", false], ["Error", false]]);
        this.visible = false;
    }

    forceNavigate(name: string) {
        this.router.navigate(['/landing']);
        if (name != ''){
            this.fragService.setFragment(name);
        }
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
            timer(VALIDATION_DELAY).pipe(
                switchMap((delay: 0) => this.getToken()),
                switchMap((token: string) => this.signupService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) =>
                (score instanceof HttpErrorResponse || score < 0.7) ? of('Error') : this.signupService.signup(this.getFormValues())),
                catchError(() => of("Error"))
            ).subscribe({
                next: (value: string | SignupResult) => {
                    if (value.constructor === SignupResult && value.outcome) {
                        this.setStatus('Success')
                    } else {
                        this.setStatus('Error')
                    }
                },
                complete: () => {
                    this.toggleModalVisibility();
                }
            })
        }
    }

    //Method required for testing
    public getToken(): Observable<string>{
        return this.recaptchaV3Service.execute('submit');
    }

    toggleModalVisibility() {
        this.visible = !this.visible;
    }

    handleLiveChange(event: any) {
        this.visible=event;
    }

    private setStatus(status: string){
        this.status.forEach((value, key) => {
            if (status == key){
                this.status.set(key, true);
            } else {
                this.status.set(key, false);
            }
        })
    }

    public getStatus(){
        for (let item of this.status){
            if (item[1]){
                return item[0];
            }
        }
        return 'Error';
    }
}
