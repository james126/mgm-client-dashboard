import { NgIf } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'
import {
    AlertComponent,
    AlertHeadingDirective,
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
    RowComponent,
} from '@coreui/angular'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { catchError, debounceTime, fromEvent, Observable, of, Subscription, switchMap, timer } from 'rxjs'
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { ASYNC_DELAY } from '../../login.component'
import { LoginService, Result } from '../../service/login.service'

const { required, maxLength, email } = Validators

export enum Status {
    Idle = 'Idle',
    Success = 'Success',
    Invalid = 'Invalid',
    Error = 'Error'
}

@Component({
    selector: 'reset-password',
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
        RowComponent,
        FormControlDirective,
        AlertComponent,
        NgIf,
        RouterLink,
        ReactiveFormsModule, InputGroupTextDirective],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    @Input() visible: boolean;
    public internalVisible: boolean;
    @Output() changeVisible: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('emailInput', { static: true }) emailInput!: ElementRef
    public emailValid: boolean | undefined
    public resetPassEmail: FormGroup
    public email$: Subscription | undefined
    public status: Status
    readonly faLock = faLock


    constructor(private formBuilder: NonNullableFormBuilder, private loginService: LoginService) {
        this.resetPassEmail = this.formBuilder.group({
            email: ['', {
                validators: [required, email, maxLength(40)],
                updateOn: 'change',
            }],
        })

        this.emailValid = undefined
        this.visible = false;
        this.internalVisible = false;
        this.status = Status.Idle;
    }

    ngOnInit(): void {
        this.email$ = fromEvent(this.emailInput.nativeElement, 'focus')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.emailInput.nativeElement.value.trim()
                let regex = new RegExp('\\S+[@]\\S+[.]\\S+')
                let valid = regex.test(value)
                if (value.length == 0) {
                    this.emailValid = false
                } else if (valid) {
                    this.emailValid = true
                } else {
                    this.emailValid = false
                }
            })
    }

    public onSubmit() {
        if(this.resetPassEmail.valid) {
            timer(ASYNC_DELAY).pipe(
                switchMap(() => this.getToken()),
                switchMap((token: string) => this.loginService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) =>
                    (score instanceof HttpErrorResponse || score < 0.7) ? of('Error') : this.loginService.forgotPassCheck(this.resetPassEmail.get('email')!.value)),
                catchError(() => of('Error')),
            )
                .subscribe({
                    next: (value: string | Result) => {
                        if (value.constructor === Result) {
                            this.status = Status.Success
                        } else {
                            this.status = Status.Error
                        }
                    },
                    error: () => {
                        this.status = Status.Error
                    }
                })
        } else {
            this.status = Status.Error //this method should only be called if this.resetPassEmail is valid (as submit button is now enabled)
        }
    }

    public isVisible() {
        if (this.visible == false){
            if (this.internalVisible) {
                this.resetPassEmail.get('email')?.reset();
                this.status = Status.Idle
                this.internalVisible = false;
            }
            return false;
        } else {
            if (!this.internalVisible) {
                this.resetPassEmail.get('email')?.reset();
                this.status = Status.Idle
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
        this.resetPassEmail.get('email')?.reset();
        this.status = Status.Idle
        this.changeVisible.emit(false);
    }

    /*
     Required for c-modal element
     event: true when modal switched from invisible to visible
     false when modal switched from visible to invisible
     can be used for other events etc
     */
    handleChange(event: boolean) {
        this.resetPassEmail.get('email')?.reset();
        this.status = Status.Idle
    }

    ngOnDestroy(): void {
        this.email$?.unsubscribe();
    }
}
