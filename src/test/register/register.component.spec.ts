
import { DebugElement  } from '@angular/core'
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular'
import { IconModule } from '@coreui/icons-angular'
import { IconSetService } from '@coreui/icons-angular'
import _default from 'chart.js/dist/plugins/plugin.tooltip'
import { of, throwError } from 'rxjs'
import { ControlErrorsComponent } from '../../app/views/pages/register/components/control-errors.component'
import { RegisterComponent, VALIDATION_DELAY } from '../../app/views/pages/register/register.component'
import { PasswordStrength, SignupService } from '../../app/views/pages/register/services/signup.service'
import { email, password, repeatPassword, signupData, username } from './register-dummy-data'
import { dispatchFakeEvent, formatErrors, updateTrigger, } from './resgister-component-helper'
import { iconSubset } from 'src/app/icons/icon-subset'

describe('RegisterComponent', () => {
    let component: RegisterComponent
    let fixture: ComponentFixture<RegisterComponent>
    let debugElement: DebugElement
    let signupService: jasmine.SpyObj<SignupService>;
    let strength: PasswordStrength;
    let iconSetService: IconSetService;

    const fillForm = () => {
        updateTrigger(fixture,"username", username);
        updateTrigger(fixture, "email", email);
        updateTrigger(fixture, "password", password);
        updateTrigger(fixture, "repeatPassword", repeatPassword);
    }

    beforeEach(async () => {
        strength = {
            valid: true,
            suggestions: [],
        }

        signupService = jasmine.createSpyObj<SignupService>('SignupService', {
                isUsernameTaken: of(false),
                isEmailTaken: of(false),
                signup: of({ success: true }),
                getPasswordStrength: of(strength),
            }
        )

        await TestBed.configureTestingModule({
            imports: [CardModule, FormModule, GridModule, ButtonModule, IconModule, ReactiveFormsModule, ControlErrorsComponent, IconModule],
            providers: [IconSetService, RegisterComponent, { provide: SignupService, useValue: signupService }],
            declarations: [],
        }).compileComponents();

        iconSetService = TestBed.inject(IconSetService);
        iconSetService.icons =  { ...iconSubset };

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    })

    it('Successful form submission', fakeAsync(() => {
        let submitButton =  debugElement.query(By.css(`[data-testid="submit"]`));
        expect(submitButton.nativeElement.disabled).toBeTrue()

        fillForm();
        tick(VALIDATION_DELAY);
        fixture.detectChanges(); //updates DOM

        expect(submitButton.nativeElement.disabled).toBeFalse()

        submitButton.triggerEventHandler('click', null);
        tick(VALIDATION_DELAY);

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

    it('Asynchronous validators - password weak', fakeAsync(() => {
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


