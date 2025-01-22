import { DebugElement } from '@angular/core'
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { IconSetService } from '@coreui/icons-angular'
import { of } from 'rxjs'
import { iconSubset } from '../../app/icons/icon-subset'
import { ASYNC_DELAY, NewPasswordComponent, PasswordStatus } from '../../app/views/pages/login/reset-password/new-password/new-password.component'
import { LoginService, PasswordStrength, Result } from '../../app/views/pages/login/service/login.service'
import { updateTrigger } from '../test-util/update-form-helper'

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;
  let debugElement: DebugElement
  let loginService: jasmine.SpyObj<LoginService>
  let iconSetService: IconSetService
  let passStrength: PasswordStrength = {
    valid: true,
    suggestions: [],
  }

  beforeEach(async () => {
    loginService = jasmine.createSpyObj<LoginService>('LoginService', {
          login: of(new Result(true, null, false)),
          getToken: of('123'),
          submitRecaptcha: of(1),
          forgotPassCheck: of(true),
          newPass: of(new Result(true, null, false)),
          validateLoginInput: true,
          getPasswordStrength: of(passStrength)
        },
    )

    await TestBed.configureTestingModule({
      imports: [NewPasswordComponent],
      providers: [IconSetService, provideAnimations(), { provide: LoginService, useValue: loginService }]
    })
    .compileComponents();
    iconSetService = TestBed.inject(IconSetService)
    iconSetService.icons = { ...iconSubset }

    fixture = TestBed.createComponent(NewPasswordComponent);
    fixture.detectChanges()
    component = fixture.componentInstance;
    debugElement = fixture.debugElement
    component.visible = true;
    fixture.detectChanges(); // triggers change detection to update the view
  });

  it('submission success popup', () => {
    component.status = PasswordStatus.Success;
    let modalText = debugElement.query(By.css(`[data-testid="new-password-modal"]`)).nativeElement.innerText
    expect(modalText.includes('Password Changed')).toBeTrue()
  });

  it('submission error popup', () => {
    component.status = PasswordStatus.Error;
    let modalText = debugElement.query(By.css(`[data-testid="new-password-modal"]`)).nativeElement.innerText
    expect(modalText.includes('Submission Error')).toBeTrue()
  });

  it('will not submit an invalid form', fakeAsync(() => {
    let submitButton = debugElement.query(By.css('[data-testid="submit-new-pass"]'))

    updateTrigger(fixture, 'newPass', 'abc')
    updateTrigger(fixture, 'repeatNewPass', 'def')
    tick(ASYNC_DELAY)
    fixture.detectChanges()

    expect(submitButton.nativeElement.disabled).toBeTrue()
  }));

  it('password synchronously validated', () => {
    updateTrigger(fixture, 'newPass', 'abc')
    fixture.detectChanges()
    expect(component.form.get('newPass')?.errors).not.toBeNull()

    updateTrigger(fixture, 'newPass', 'Windows11%')
    fixture.detectChanges()
    expect(component.form.get('newPass')?.errors).toBeNull()
  });

  it('password asynchronously validated', fakeAsync(() => {
    updateTrigger(fixture, 'newPass', 'abc')
    tick(ASYNC_DELAY)
    fixture.detectChanges()
    flush()
    expect(component.form.controls['newPass'].valid).toBeFalse()

    updateTrigger(fixture, 'newPass', 'Windows11%')
    tick(ASYNC_DELAY)
    fixture.detectChanges()
    flush()
    expect(component.form.controls['newPass'].valid).toBeTrue()
  }));

  it('password is the same as repeat-password', fakeAsync(() => {
    let spy = spyOn<any>(component, 'validateRepeatedPassword').and.callThrough()
    updateTrigger(fixture, 'newPass', 'Windows11%')
    updateTrigger(fixture, 'repeatNewPass', 'Windows11%')
    tick(ASYNC_DELAY)
    fixture.detectChanges()

    expect(component.form.valid).toBeTrue()
    expect(spy).toHaveBeenCalled();
  }));

  it('toggle password display', fakeAsync(() => {
    let password = debugElement.query(By.css(`[data-testid="newPass"]`))
    let toggle = debugElement.query(By.css(`[data-testid="new-pass-toggle"]`))

    updateTrigger(fixture, 'newPass', 'Windows11%')
    tick(ASYNC_DELAY)
    fixture.detectChanges()
    expect(password.attributes['type']).toBe('password')

    toggle.triggerEventHandler('click', null)
    fixture.detectChanges()
    expect(password.attributes['type']).toBe('txt')

    toggle.triggerEventHandler('click', null)
    fixture.detectChanges()
    expect(password.attributes['type']).toBe('password')
    flush()
  }));

  xit('submit valid form and change status', fakeAsync(() => {
    let spy = spyOn<any>(component, 'onSubmit').and.callThrough()
    let submitButton = debugElement.query(By.css('[data-testid="submit-new-pass"]'))

    updateTrigger(fixture, 'newPass', 'Windows11%')
    updateTrigger(fixture, 'repeatNewPass', 'Windows11%')
    tick(ASYNC_DELAY)
    fixture.detectChanges()

    submitButton.triggerEventHandler('click', null)
    tick(ASYNC_DELAY)
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
    expect(component.status).toBe(PasswordStatus.Success)
  }));

  xit('invalid password displays asynchronous feedback', fakeAsync(() => {
    const strength: PasswordStrength = {
      valid: false,
      suggestions: ['requiresSpecial'],
    }
    loginService.getPasswordStrength.and.returnValue(of(strength))

    updateTrigger(fixture, 'newPass', 'Windows111')
    tick(ASYNC_DELAY)
    fixture.detectChanges()

    let el = debugElement.query(By.css(`#new-pass-errors`))
    expect(el.nativeElement.textContent).toContain('Special character')
  }));

  xit('repeated password is not the same feedback', fakeAsync(() => {
    updateTrigger(fixture, 'newPass', 'Windows11%')
    updateTrigger(fixture, 'newPass', 'Windows10%')
    tick(ASYNC_DELAY)
    fixture.detectChanges()

    let el = debugElement.query(By.css(`#new-repeat-pass-errors`))
    expect(el.nativeElement.textContent).toContain('Passwords don\'t match')
  }));
});
