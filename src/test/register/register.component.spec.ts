import { HttpErrorResponse } from '@angular/common/http'
import { DebugElement } from '@angular/core'
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { ButtonModule, CardModule, FormModule, GridModule, ModalModule } from '@coreui/angular'
import { IconModule, IconSetService } from '@coreui/icons-angular'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha'
import { of, throwError } from 'rxjs'
import { iconSubset } from 'src/app/icons/icon-subset'
import { environment } from 'src/environments/environment.test'
import { ASYNC_DELAY, RegisterComponent} from '../../app/views/pages/register/register.component'
import { PasswordStrength, SignupResult, SignupService } from '../../app/views/pages/register/service/signup.service'
import { dispatchFakeInputEvent, updateTrigger } from '../test-util/update-form-helper'
import { email, password, repeatPassword, signupData, username } from './dummy-data'
import { formatErrors } from '../../app/views/pages/login/reset-password/new-password/format-validation-errors'

describe('RegisterComponent', () => {
    let component: RegisterComponent
    let fixture: ComponentFixture<RegisterComponent>
    let debugElement: DebugElement
    let signupService: jasmine.SpyObj<SignupService>
    let strength: PasswordStrength
    let iconSetService: IconSetService
    const DELAY = ASYNC_DELAY * 10

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
                submitRecaptcha: of(1),
                getToken: of("abc")
            },
        )

        await TestBed.configureTestingModule({
            imports: [CardModule, FormModule, GridModule, ButtonModule, IconModule, ReactiveFormsModule, IconModule,
                FontAwesomeModule, ModalModule, RouterModule.forRoot([])],
            providers: [IconSetService, RegisterComponent, { provide: SignupService, useValue: signupService },
                { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaV3 }, provideAnimations()],
            declarations: [],
        }).compileComponents()

        iconSetService = TestBed.inject(IconSetService)
        iconSetService.icons = { ...iconSubset }

        fixture = TestBed.createComponent(RegisterComponent)
        component = fixture.componentInstance
        debugElement = fixture.debugElement
        fixture.detectChanges()
        spyOn(component, 'getToken').and.returnValue(of('123'))
    })

    it('Successful form submission', fakeAsync(() => {
        let submitButton = debugElement.query(By.css(`[data-testid="submit"]`))
        expect(submitButton.nativeElement.disabled).toBeTrue()

        fillForm()
        tick(DELAY)
        fixture.detectChanges()

        expect(submitButton.nativeElement.disabled).toBeFalse()

        submitButton.triggerEventHandler('click', null)
        tick(DELAY)
        fixture.detectChanges() //updates DOM

        expect(signupService.signup).toHaveBeenCalledWith(signupData)
        expect(component.status).toBe("Success")
        flush() //finish any async operations
    }))

    it('Don\'t submit invalid form', fakeAsync(() => {
        let submitButton = debugElement.query(By.css(`[data-testid="submit"]`))
        tick(DELAY) // Wait for async validators

        submitButton.triggerEventHandler('click', null)

        expect(signupService.isUsernameTaken).not.toHaveBeenCalled()
        expect(signupService.isEmailTaken).not.toHaveBeenCalled()
        expect(signupService.getPasswordStrength).not.toHaveBeenCalled()
        expect(signupService.signup).not.toHaveBeenCalled()
        expect(component.status).toBe("Idle")
        flush();
    }))

    it('Form submission failure', fakeAsync(async () => {
        signupService.signup.and.returnValue(throwError(() => 'server error'))

        let submitButton = debugElement.query(By.css(`[data-testid="submit"]`))
        fillForm()
        tick(DELAY)
        fixture.detectChanges()

        submitButton.triggerEventHandler('click', null)
        tick(DELAY)
        expect(component.status).toBe("Error")
    }))

    it('Required fields', fakeAsync(() => {
        const requiredFields = [
            'username',
            'email',
            'password',
            'repeatPassword',
        ]

        // Mark required fields as touched
        requiredFields.forEach((testId) => {
            dispatchFakeInputEvent(fixture, testId)
            tick(DELAY)
            fixture.detectChanges()

            let el = debugElement.query(By.css(`#${testId}-errors`))
            let string = ''

            switch (testId.valueOf()) {
                case "username":
                    string = "Enter a username"
                    break

                case "email":
                    string = "Enter an email address"
                    break

                case "password":
                    string = "Enter a password"
                    break

                case "repeatPassword":
                    string = "Repeat password"
                    break
            }

            let regex = new RegExp(string)
            let valid = regex.test(el.nativeElement.textContent)

            expect(valid).toBe(true)
        })
    }))

    it('Asynchronous validators - username taken', fakeAsync(() => {
        let submitButton = debugElement.query(By.css(`[data-testid="submit"]`))
        signupService.isUsernameTaken.and.returnValue(of(true))
        fillForm()
        tick(DELAY)
        fixture.detectChanges()

        expect(submitButton.nativeElement.disabled).toBeTrue()
        expect(signupService.isUsernameTaken).toHaveBeenCalledWith(username)
        expect(signupService.signup).not.toHaveBeenCalled()
    }))

    it('Async validator - password weak', fakeAsync(() => {
        let submitButton = debugElement.query(By.css(`[data-testid="submit"]`))

        let weakPassword: PasswordStrength = {
            valid: false,
            suggestions: ['requiresUppercase', 'requiresNumeric', 'requiresSpecial'],
        }
        signupService.getPasswordStrength.and.returnValue(of(weakPassword))

        fillForm()
        tick(DELAY)
        fixture.detectChanges()

        updateTrigger(fixture, 'password', 'aaaaaaaaaa')
        tick(DELAY)
        fixture.detectChanges()

        const actualErrors = formatErrors(weakPassword.suggestions)
        const expectedErrors = component.register.controls['password'].errors

        expect(expectedErrors).not.toBeNull()
        expect(actualErrors).toEqual(expectedErrors!)
        expect(submitButton.nativeElement.disabled).toBeTrue()
    }))

    it('Async validator - server error displays message', fakeAsync(() => {
        const mockErrorResponse = new HttpErrorResponse({
            error: 'Server Error',
            status: 500,
            statusText: 'Internal Server Error',
            url: `${environment.server}${environment.usernameTaken}?userName=${username}`,
        })

        signupService.isUsernameTaken.and.returnValue(of(mockErrorResponse))

        fillForm()
        tick(DELAY)
        fixture.detectChanges()

        let el = debugElement.query(By.css(`#username-errors`))

        let string = '^.{1} Server error, try again later $'
        let regex = new RegExp(string)
        let valid = regex.test(el.nativeElement.textContent)

        expect(valid).toBe(true)
    }))

    it('Toggle password display', fakeAsync(() => {
        let password = debugElement.query(By.css(`[data-testid="password"]`))
        let toggle = debugElement.query(By.css(`[data-testid="pass-toggle"]`))

        fillForm()
        tick(DELAY)
        fixture.detectChanges()
        expect(password.attributes['type']).toBe('password')

        toggle.triggerEventHandler('click', null)
        fixture.detectChanges()
        expect(password.attributes['type']).toBe('txt')

        toggle.triggerEventHandler('click', null)
        fixture.detectChanges()
        expect(password.attributes['type']).toBe('password')
        flush() //finish any async operations
    }))

    it('Successful submission popup', fakeAsync(() => {
        let submitButton = debugElement.query(By.css(`[data-testid="submit"]`))

        fillForm()
        tick(DELAY)
        fixture.detectChanges()

        submitButton.triggerEventHandler('click', null)
        tick(DELAY)
        fixture.detectChanges() //updates DOM

        let modalText = debugElement.query(By.css(`[data-testid="modal"]`)).nativeElement.innerText
        expect(modalText.includes('Thank You')).toBe(true)
        expect(modalText.includes('Registration successful')).toBe(true)
        flush() //finish any async operations
    }))

    it('Unsuccessful submission popup', fakeAsync(async () => {
        signupService.signup.and.returnValue(throwError(() => 'server error'))

        let submitButton = debugElement.query(By.css(`[data-testid="submit"]`))
        fillForm()
        tick(DELAY)
        fixture.detectChanges()

        submitButton.triggerEventHandler('click', null)
        tick(DELAY)
        fixture.detectChanges()

        let modalText = debugElement.query(By.css(`[data-testid="modal"]`)).nativeElement.innerText
        expect(modalText.includes('Submission Error')).toBe(true)
        expect(modalText.includes('Internal error, please try again later')).toBe(true)
        flush() //finish any async operations
    }))
})


