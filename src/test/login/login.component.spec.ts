import { HttpErrorResponse } from '@angular/common/http'
import { DebugElement  } from '@angular/core'
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { ButtonDirective, ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular'
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha'
import { of, throwError } from 'rxjs'
import { DashboardComponent } from '../../app/views/dashboard/dashboard.component'
import { LoginComponent  } from '../../app/views/pages/login/login.component'
import { IconModule } from '@coreui/icons-angular'
import { IconSetService } from '@coreui/icons-angular'
import { iconSubset } from '../../app/icons/icon-subset'
import { LoginData, Result, LoginService, PasswordStrength } from '../../app/views/pages/login/service/login.service'
import { ASYNC_DELAY } from '../../app/views/pages/login/login.component'
import { environment } from '../../environments/environment.test'
import { loginData } from './dummy-data'
import { updateTrigger } from '../test-util/update-form-helper'

describe('LoginComponent', () => {
    let component: LoginComponent
    let fixture: ComponentFixture<LoginComponent>
    let debugElement: DebugElement
    let loginService: jasmine.SpyObj<LoginService>
    let iconSetService: IconSetService
    let testData: LoginData
    let passStrength: PasswordStrength = {
        valid: true,
        suggestions: [],
    }

    const fillForm = () => {
        updateTrigger(fixture, 'username', testData.username)
        updateTrigger(fixture, 'password', testData.password)
    }

    beforeEach(async () => {
        loginService = jasmine.createSpyObj<LoginService>('LoginService', {
                login: of(new Result(true, null)),
                getToken: of('123'),
                submitRecaptcha: of(1),
                forgotPassCheck: of(true),
                newPass: of(null),
                validateLoginInput: true,
                getPasswordStrength: of(passStrength)
            }
        )

        await TestBed.configureTestingModule({
            imports: [FormModule, CardModule, GridModule, ButtonModule, IconModule, LoginComponent, ReactiveFormsModule,
            RouterTestingModule.withRoutes([ { path: 'dashboard', component: DashboardComponent }]) , ButtonDirective],
            providers: [IconSetService, LoginComponent, { provide: LoginService, useValue: loginService },
                { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaV3 }, provideAnimations()],
        }).compileComponents()

        iconSetService = TestBed.inject(IconSetService)
        iconSetService.icons = { ...iconSubset }
        testData = loginData

        fixture = TestBed.createComponent(LoginComponent)
        component = fixture.componentInstance
        debugElement = fixture.debugElement
        fixture.detectChanges()
        spyOn(component, 'getToken').and.returnValue(of('123'))
    })

    it('Submit login - successful shows status Success', fakeAsync(() => {
        const router = TestBed.inject(Router);
        const promise = new Promise<boolean>((resolve, reject) => { true });
        //prevents warning 'Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?'
        spyOn(router, 'navigate').and.returnValue(promise)

        let submitButton = debugElement.query(By.css('[data-testid="submit-login"]'))
        expect(submitButton.nativeElement.disabled).toBeTrue()

        fillForm()
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        expect(submitButton.nativeElement.disabled).toBeFalse()

        submitButton.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges() //updates DOM

        expect(loginService.login).toHaveBeenCalledWith(testData)
        expect(router.navigate).toHaveBeenCalled()
        expect(component.loginStatus).toBe("Success")
        flush() //finish any async operations
    }))

    it('Submit login - invalid shows Status invalid', fakeAsync(() => {
        let submitButton = debugElement.query(By.css(`[data-testid="submit-login"]`))
        loginService.validateLoginInput.and.returnValue(false);

        updateTrigger(fixture, 'username', 'sam')
        updateTrigger(fixture, 'password', testData.password)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        submitButton.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        expect(component.loginStatus).toBe("Invalid")
        flush() //finish any async operations
    }))

    it('Submit login - server error shows Status Error', fakeAsync(() => {
        loginService.login.and.returnValue(throwError(() => 'server error'))
        let submitButton = debugElement.query(By.css(`[data-testid="submit-login"]`))

        fillForm()
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        submitButton.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        expect(component.loginStatus).toBe("Error")
        flush() //finish any async operations
    }))

    it('Login popup - HttpErrorResponse shows Status Error', fakeAsync(() => {
        const mockErrorResponse = new HttpErrorResponse({
            error: 'Server Error',
            status: 500,
            statusText: 'Internal Server Error',
            url: `${environment.server}${environment.login}`,
        })
        loginService.login.and.returnValue(of(mockErrorResponse))
        let submitButton = debugElement.query(By.css(`[data-testid="submit-login"]`))

        fillForm()
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        submitButton.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        expect(component.loginStatus).toBe("Error")
        flush() //finish any async operations
    }))

    it('Toggle password display', fakeAsync(() => {
        let password = debugElement.query(By.css(`[data-testid="password"]`))
        let toggle = debugElement.query(By.css(`[data-testid="pass-toggle"]`))

        fillForm()
        tick(ASYNC_DELAY)
        fixture.detectChanges()
        expect(password.attributes['type']).toBe('password')

        toggle.triggerEventHandler('click', null)
        fixture.detectChanges()
        expect(password.attributes['type']).toBe('txt')

        toggle.triggerEventHandler('click', null)
        fixture.detectChanges()
        expect(password.attributes['type']).toBe('password')
    }))

    it('Required input fields are checked', fakeAsync(() => {
        let submitButton = debugElement.query(By.css(`[data-testid="submit-login"]`))

        updateTrigger(fixture, 'password', testData.password)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        submitButton.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        expect(component.login.get('username')?.hasError('required')).toBe(true)
        expect(component.loginStatus).toBe("Invalid")
        flush() //finish any async operations
    }))

    it('Displays reset password popup', fakeAsync(() => {
        let forgotPassword = debugElement.query(By.css(`[data-testid="forgot-password-link"]`))
        forgotPassword.triggerEventHandler('click', null)
        fixture.detectChanges()

        let loginModal = debugElement.query(By.css(`[data-testid="login-modal"]`))
        let passwordResetModal = debugElement.query(By.css(`[data-testid="reset-password-modal"]`))

        expect(loginModal.nativeElement.getAttribute('ng-reflect-visible')).toBe('false');
        expect(passwordResetModal.nativeElement.getAttribute('ng-reflect-visible')).toBe('true');
        expect(passwordResetModal.nativeElement.innerText.includes('Reset Password')).toBe(true)
        flush();
    }))
})

