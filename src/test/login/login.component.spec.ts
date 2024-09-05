import { DebugElement } from '@angular/core'
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular'
import { of } from 'rxjs'
import { LoginComponent } from '../../app/views/pages/login/login.component'
import { IconModule } from '@coreui/icons-angular'
import { IconSetService } from '@coreui/icons-angular'
import { iconSubset } from '../../app/icons/icon-subset'
import { ASYNC_DELAY } from '../../app/views/pages/register/register.component'
import { SignupResult, SignupService } from '../../app/views/pages/register/service/signup.service'
import { email, password, repeatPassword, signupData, username } from '../register/util/dummy-data'
import { updateTrigger } from '../util/update-form-helper'

xdescribe('LoginComponent', () => {
    let component: LoginComponent
    let fixture: ComponentFixture<LoginComponent>
    let debugElement: DebugElement
    let iconSetService: IconSetService

    const fillForm = () => {
        updateTrigger(fixture, 'username', username)
        updateTrigger(fixture, 'email', email)
        updateTrigger(fixture, 'password', password)
        updateTrigger(fixture, 'repeatPassword', repeatPassword)
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormModule, CardModule, GridModule, ButtonModule, IconModule, LoginComponent],
            providers: [IconSetService],
        })
            .compileComponents()

        // beforeEach(() => {
        //   loginService = jasmine.createSpyObj<SignupService>('SignupService', {
        //         login: of(new SignupResult(true, null)),
        //         submitRecaptcha: of(1),
        //       },
        //   )

        iconSetService = TestBed.inject(IconSetService)
        iconSetService.icons = { ...iconSubset }

        fixture = TestBed.createComponent(LoginComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    xit('Successful login submission', fakeAsync(() => {
        let submitButton = debugElement.query(By.css(`[data-testid="submit"]`))
        expect(submitButton.nativeElement.disabled).toBeTrue()

        fillForm()
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        expect(submitButton.nativeElement.disabled).toBeFalse()

        submitButton.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges() //updates DOM

        // expect(signupService.signup).toHaveBeenCalledWith(signupData)
        // expect(component.getStatus()).toBe('Success')
        flush() //finish any async operations
    }))

    xit('Invalid form', fakeAsync(() => {

    }))

    xit('Submission failure - server error', fakeAsync(() => {

    }))

    xit('Submission failure - synchronous validators username', fakeAsync(() => {

    }))

    xit('Required fields', fakeAsync(() => {

    }))

    xit('Toggle password display', fakeAsync(() => {

    }))

    xit('Successful login popup', fakeAsync(() => {

    }))

    xit('Unsuccessful login popup', fakeAsync(() => {

    }))

})

