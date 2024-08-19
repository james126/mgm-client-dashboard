
import { HttpErrorResponse } from '@angular/common/http'
import { DebugElement, } from '@angular/core'
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular'
import { IconModule } from '@coreui/icons-angular'
import { IconSetService } from '@coreui/icons-angular'
import _default from 'chart.js/dist/plugins/plugin.tooltip'
import { RECAPTCHA_V3_SITE_KEY  } from 'ng-recaptcha'
import { of, throwError } from 'rxjs'
import { environment } from 'src/environments/environment.test'
import { ControlErrorsComponent } from '../../app/views/pages/register/components/control-errors.component'
import { RegisterComponent, VALIDATION_DELAY } from '../../app/views/pages/register/register.component'
import { PasswordStrength, SignupResult, SignupService } from '../../app/views/pages/register/services/signup.service'
import { email, password, repeatPassword, signupData, username } from './util/dummy-data'
import { dispatchFakeEvent, updateTrigger } from './util/update-form-helper'
import { iconSubset } from 'src/app/icons/icon-subset'
import { formatErrors } from './util/format-errors-helper'

describe('RegisterComponent', () => {
    let component: RegisterComponent
    let fixture: ComponentFixture<RegisterComponent>
    let debugElement: DebugElement
    let signupService: jasmine.SpyObj<SignupService>
    let strength: PasswordStrength
    let iconSetService: IconSetService

    const fillForm = () => {
        updateTrigger(fixture, 'username', username)
        updateTrigger(fixture, 'email', email)
        updateTrigger(fixture, 'password', password)
        updateTrigger(fixture, 'repeatPassword', repeatPassword)
    }

    beforeEach(async () => {
        strength = {
            valid: true,
            suggestions: [],
        }

        signupService = jasmine.createSpyObj<SignupService>('SignupService', {
                isUsernameTaken: of(false),
                isEmailTaken: of(false),
                signup: of(new SignupResult(true, null)),
                getPasswordStrength: of(strength),
                submitRecaptcha: of(1)
            }
        )

        await TestBed.configureTestingModule({
            imports: [CardModule, FormModule, GridModule, ButtonModule, IconModule, ReactiveFormsModule, ControlErrorsComponent, IconModule],
            providers: [IconSetService, RegisterComponent, { provide: SignupService, useValue: signupService },
                { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaV3 }],
            declarations: [],
        }).compileComponents();

        iconSetService = TestBed.inject(IconSetService);
        iconSetService.icons =  { ...iconSubset };

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance
        debugElement = fixture.debugElement;
        fixture.detectChanges();

        spyOn(component, 'getToken').and.returnValue(of("123"))
        component.submit.unsubscribe();
    })

    it('Successful form submission', fakeAsync(() => {
        let submitButton =  debugElement.query(By.css(`[data-testid="submit"]`));
        expect(submitButton.nativeElement.disabled).toBeTrue()

        fillForm();
        tick(VALIDATION_DELAY);
        fixture.detectChanges();

        expect(submitButton.nativeElement.disabled).toBeFalse()

        submitButton.triggerEventHandler('click', null);
        tick(1000);
        fixture.detectChanges() //updates DOM

        expect(signupService.signup).toHaveBeenCalledWith(signupData);
        expect(component.status).toBe('success')
    }))

    it('Invalid form', fakeAsync(() => {
        let submitButton =  debugElement.query(By.css(`[data-testid="submit"]`));
        tick(VALIDATION_DELAY); // Wait for async validators

        submitButton.triggerEventHandler('click', null);

        expect(signupService.isUsernameTaken).not.toHaveBeenCalled();
        expect(signupService.isEmailTaken).not.toHaveBeenCalled();
        expect(signupService.getPasswordStrength).not.toHaveBeenCalled();
        expect(signupService.signup).not.toHaveBeenCalled();
        expect(component.status).toBe('idle')
    }));

    it('Form submission failure', fakeAsync(async () => {
        signupService.signup.and.returnValue(throwError(() => 'server error'))

        let submitButton =  debugElement.query(By.css(`[data-testid="submit"]`));
        fillForm();
        tick(VALIDATION_DELAY);
        fixture.detectChanges();

        submitButton.triggerEventHandler('click', null);
        tick(VALIDATION_DELAY);
        expect(component.status).toBe('error')
    }));

    it('Required fields', fakeAsync(() => {
        const requiredFields = [
            'username',
            'email',
            'password',
            'repeatPassword'
        ];

        // Mark required fields as touched
        requiredFields.forEach((testId) => {
            dispatchFakeEvent(fixture, testId)
            tick(VALIDATION_DELAY);
            fixture.detectChanges();

            let el = debugElement.query(By.css(`#${testId}-errors`));
            let string = (testId == 'repeatPassword') ? `^.+(Enter password again).+$` : `^.+(Enter).+(${testId}).+$`;
            let regex = new RegExp(string)
            let valid = regex.test(el.nativeElement.textContent)

            expect(valid).toBe(true);
        });
    }))

    it('Asynchronous validators - username taken', fakeAsync(() => {
        let submitButton =  debugElement.query(By.css(`[data-testid="submit"]`));
        signupService.isUsernameTaken.and.returnValue(of(true))
        fillForm();
        tick(VALIDATION_DELAY);
        fixture.detectChanges();

        expect(submitButton.nativeElement.disabled).toBeTrue()
        expect(signupService.isUsernameTaken).toHaveBeenCalledWith(username);
        expect(signupService.signup).not.toHaveBeenCalled();
    }))

    it('Async validator - password weak', fakeAsync(() => {
        let submitButton =  debugElement.query(By.css(`[data-testid="submit"]`));

        let weakPassword: PasswordStrength = {
            valid: false,
            suggestions: ['requiresUppercase', 'requiresNumeric', 'requiresSpecial'],
        }
        signupService.getPasswordStrength.and.returnValue(of(weakPassword))

        fillForm();
        tick(VALIDATION_DELAY);
        fixture.detectChanges();

        updateTrigger(fixture, "password", "aaaaaaaaaa");
        tick(VALIDATION_DELAY);
        fixture.detectChanges();

        const actualErrors = formatErrors(weakPassword.suggestions);
        const expectedErrors = component.register.controls['password'].errors;

        expect(expectedErrors).not.toBeNull()
        expect(actualErrors).toEqual(expectedErrors!);
        expect(submitButton.nativeElement.disabled).toBeTrue()
    }))

    it('Async validator - server error displays message', fakeAsync(() => {
        const mockErrorResponse = new HttpErrorResponse({
            error: 'Server Error',
            status: 500,
            statusText: 'Internal Server Error',
            url: `${environment.server}${environment.usernameTaken}?userName=${username}`
        });

        signupService.isUsernameTaken.and.returnValue(of(mockErrorResponse))

        fillForm();
        tick(VALIDATION_DELAY);
        fixture.detectChanges();

        let el = debugElement.query(By.css(`#username-errors`));

        let string = '^.{1} Server error, try again later $';
        let regex = new RegExp(string)
        let valid = regex.test(el.nativeElement.textContent)

        expect(valid).toBe(true);
    }))

    it('Toggle password display', fakeAsync(() => {
        let password =  debugElement.query(By.css(`[data-testid="password"]`));
        let toggle =  debugElement.query(By.css(`[data-testid="pass-toggle"]`));

        fillForm();
        tick(VALIDATION_DELAY);
        fixture.detectChanges();
        expect(password.attributes['type']).toBe('password');

        toggle.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(password.attributes['type']).toBe('txt');

        toggle.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(password.attributes['type']).toBe('password');
    }))
})


