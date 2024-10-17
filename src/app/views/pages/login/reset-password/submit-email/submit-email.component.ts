import { HttpErrorResponse } from '@angular/common/http'
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'
import {
    AlertComponent,
    ButtonCloseDirective,
    ButtonDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
} from '@coreui/angular'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { catchError, debounceTime, fromEvent, Observable, of, Subscription, switchMap, timer } from 'rxjs'
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { LoginService, Result } from '../../service/login.service'

const { required, maxLength, email } = Validators

export enum EmailStatus {
    Idle = 'Idle',
    Success = 'Success',
    Error = 'Error'
}

export const ASYNC_DELAY = 1000

@Component({
    selector: 'reset-password-submit-email',
    standalone: true,
    imports: [ButtonCloseDirective,
        ButtonDirective,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        InputGroupComponent,
        FormControlDirective,
        AlertComponent,
        RouterLink,
        ReactiveFormsModule,
        InputGroupTextDirective],
    templateUrl: './submit-email.component.html',
    styleUrl: './submit-email.component.scss',
})
export class SubmitEmailComponent implements OnInit, OnDestroy {
    @Input() visible: boolean;
    public internalVisible: boolean;
    @Output() changeVisible: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('emailInput', { static: true }) emailInput!: ElementRef
    public emailValid: boolean | undefined
    public form: FormGroup
    public email$: Subscription | undefined
    public status: EmailStatus
    readonly faLock = faLock


    constructor(private formBuilder: NonNullableFormBuilder, private loginService: LoginService) {
        this.form = this.formBuilder.group({
            email: ['', {
                validators: [required, email, maxLength(40)],
                // asyncValidators: [(control: AbstractControl) => this.validatePassword(control.value)],
                updateOn: 'change',
            }],
        })

        this.emailValid = undefined
        this.visible = false;
        this.internalVisible = false;
        this.status = EmailStatus.Idle;
    }

    //Use Observer so in template input element can include attribute [valid]=
    //Gives the option of returning undefined which applies no styling
    ngOnInit(): void {
        this.email$ = fromEvent(this.emailInput.nativeElement, 'input')
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
        if(this.form.valid) {
            timer(ASYNC_DELAY).pipe(
                switchMap(() => this.getToken()),
                switchMap((token: string) => this.loginService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) =>
                    (score instanceof HttpErrorResponse || score < 0.7) ? of('Error') : this.loginService.forgotPassCheck(this.form.get('email')!.value)),
                catchError(() => of('Error')),
            ).subscribe({
                    next: (value: string | Result) => {
                        if (value.constructor === Result) {
                            this.status = EmailStatus.Success
                        } else {
                            this.status = EmailStatus.Error
                        }
                    },
                    error: () => {
                        this.status = EmailStatus.Error
                    }
                })
        } else {
            this.status = EmailStatus.Error //this method should only be called if this.resetPassEmail is valid (as submit button is now enabled)
        }
    }

    public isVisible() {
        if (this.visible == false){
            if (this.internalVisible) {
                this.form.get('email')?.reset();
                this.status = EmailStatus.Idle
                this.internalVisible = false;
            }
            return false;
        } else {
            if (!this.internalVisible) {
                this.form.get('email')?.reset();
                this.status = EmailStatus.Idle
                this.internalVisible = true;
            }
            return true;
        }
    }

    public getToken(): Observable<string>{
        return this.loginService.getToken();
    }

    public getStatus(): string {
        return this.status;
    }

    hideFeedback() {
        this.internalVisible = false;
        this.changeVisible.emit(false);
    }

    /*
     Required for c-modal element
     event: true when modal switched from invisible to visible
     false when modal switched from visible to invisible
     can be used for other events etc
     */
    handleChange(event: boolean) {
        this.form.get('email')?.reset();
        this.status = EmailStatus.Idle
        this.emailValid = undefined
    }

    ngOnDestroy(): void {
        this.email$?.unsubscribe();
    }
}
