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
import { debounceTime, fromEvent, map, of, Subscription, switchMap, timer } from 'rxjs'
import { ASYNC_DELAY, Status } from '../../../../register/register.component'
import { PasswordStrength } from '../../../../register/service/signup.service'
import { formatErrors } from '../../../../register/util/format-validation-errors'
import { LoginService } from '../../../service/login.service'

const { maxLength, minLength, required } = Validators
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
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent implements AfterViewInit, OnDestroy{
  @Input() visible: boolean;
  public internalVisible: boolean;
  @Output() changeVisible: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('password', { static: true }) passwordInput!: ElementRef
  public passwordValid: boolean | undefined
  @ViewChild('repeatPassword', { static: true }) repeatPasswordInput!: ElementRef
  public repeatPasswordValid: boolean | undefined
  public password$: Subscription | undefined
  public repeatPassword$: Subscription | undefined

  public form: FormGroup
  public show1: boolean
  public show2: boolean
  public status: PasswordStatus
  readonly faLock = faLock

  constructor(private formBuilder: NonNullableFormBuilder, private loginService: LoginService) {
    this.form = this.formBuilder.group({
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

    this.visible = false;
    this.internalVisible = false;
    this.status = PasswordStatus.Idle;
    this.show1 = false
    this.show2 = false
  }

  ngAfterViewInit(): void {
    this.password$ = fromEvent(this.passwordInput.nativeElement, 'focus')
        .pipe(debounceTime(1000))
        .subscribe(() => {
          const value = this.passwordInput.nativeElement.value.trim()
          const valid = this.form.controls['password'].valid
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
          const valid = this.form.controls['repeatPassword'].valid
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
    //
  }

  private validatePassword(password: string): ReturnType<AsyncValidatorFn> {
    return timer(ASYNC_DELAY).pipe(
        switchMap((delay) => this.loginService.getPasswordStrength(password)),
        map((value: PasswordStrength) => (value.valid ? null : formatErrors(value.suggestions))))
  }

  private validateRepeatedPassword(repeatPass: any): ReturnType<AsyncValidatorFn> {
    if (this.form.get('password') == undefined) {
      return of(null)
    }
    const pass = this.form.get('password')

    return timer(ASYNC_DELAY).pipe(
        map((delay) => (pass!.valid && pass!.value === repeatPass)),
        map((valid: boolean) => (valid ? null : { invalid: true })),
    )
  }

  public isVisible() {
    if (this.visible == false){
      if (this.internalVisible) {
        this.form.get('password')?.reset();
        this.form.get('repeatPassword')?.reset();
        this.status = PasswordStatus.Idle
        this.internalVisible = false;
      }
      return false;
    } else {
      if (!this.internalVisible) {
        this.form.get('password')?.reset();
        this.form.get('repeatPassword')?.reset();
        this.status = PasswordStatus.Idle
        this.internalVisible = true;
      }
      return true;
    }
  }

  hideFeedback() {
    this.form.get('password')?.reset();
    this.form.get('repeatPassword')?.reset();
    this.status = PasswordStatus.Idle
    this.passwordValid = undefined;
    this.repeatPasswordValid = undefined;
    this.changeVisible.emit(false);
  }

  public getStatus(): string {
    return this.status;
  }

  handleChange(event: boolean) {
    this.form.get('password')?.reset();
    this.form.get('repeatPassword')?.reset();
    this.status = PasswordStatus.Idle
    this.passwordValid = undefined;
    this.repeatPasswordValid = undefined;
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

  ngOnDestroy(): void {
    this.password$?.unsubscribe();
    this.repeatPassword$?.unsubscribe();
  }
}
