import { DebugElement } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { of } from 'rxjs'
import { EmailStatus, SubmitEmailComponent } from '../../app/views/pages/login/component/reset-password/submit-email/submit-email.component'
import { LoginService, PasswordStrength, Result } from '../../app/views/pages/login/service/login.service'
import { updateTrigger } from '../test-util/update-form-helper'
import { invalidEmail, validEmail } from './dummy-data'

describe('LoginFeedbackComponent', () => {
    let component: SubmitEmailComponent
    let fixture: ComponentFixture<SubmitEmailComponent>
    let debugElement: DebugElement
    let invalid = invalidEmail;
    let valid = validEmail;
    let loginService: jasmine.SpyObj<LoginService>
    let passStrength: PasswordStrength = {
        valid: true,
        suggestions: [],
    }

    beforeEach(async () => {
        loginService = jasmine.createSpyObj<LoginService>('LoginService', {
                login: of(new Result(true, null)),
                getToken: of('123'),
                submitRecaptcha: of(1),
                forgotPassCheck: of(true),
                validateLoginInput: true,
                getPasswordStrength: of(passStrength)
            },
        )

        await TestBed.configureTestingModule({
            imports: [SubmitEmailComponent, RouterModule.forRoot([])],
            providers: [provideAnimations(), { provide: LoginService, useValue: loginService } ],
        }).compileComponents()

        fixture = TestBed.createComponent(SubmitEmailComponent)
        component = fixture.componentInstance
        component.visible = true;
        debugElement = fixture.debugElement
        fixture.detectChanges()
    })

    it('Validate email address format', () => {
        let submitButton = debugElement.query(By.css('[data-testid="submit"]'))
        let emailInput = debugElement.query(By.css('[data-testid="email"]'))
        updateTrigger(fixture, 'email', invalid)
        fixture.detectChanges()

        expect(submitButton.nativeElement.disabled).toBeTrue()
        expect(emailInput.nativeElement.classList).toContain('ng-invalid');

        updateTrigger(fixture, 'email', valid)
        fixture.detectChanges()

        expect(submitButton.nativeElement.disabled).toBeFalse()
        expect(emailInput.nativeElement.classList).toContain('ng-valid');
    })

    it('Submission response successful', () => {
        component.status = EmailStatus.Success
        let modalText = debugElement.query(By.css(`[data-testid="reset-password-modal"]`)).nativeElement.innerText
        expect(modalText.includes('Check your email')).toBeTrue()
    })

    it('Submission response error', () => {
        component.status = EmailStatus.Error
        let modalText = debugElement.query(By.css(`[data-testid="reset-password-modal"]`)).nativeElement.innerText
        expect(modalText.includes('Submission Error')).toBeTrue()
    })
})
