import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from '@angular/core'
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import {
    ButtonModule,
    CarouselModule,
    FormControlDirective,
    ModalModule,
} from '@coreui/angular'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { HeaderComponent } from 'src/app/views/pages/landing/header/header.component'
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha'
import { FooterComponent } from 'src/app/views/pages/landing/footer/footer.component'
import { ASYNC_DELAY, LandingComponent } from 'src/app/views/pages/landing/landing.component';
import { AnimationBuilderService } from 'src/app/views/pages/landing/service/animation-builder.service'
import { AnimationService } from 'src/app/views/pages/landing/service/animation.service'
import { CarouselService } from 'src/app/views/pages/landing/service/carousel.service'
import { ContactFormService, SubmitFormResult } from 'src/app/views/pages/landing/service/contact-form.service'
import { MockComponent, MockDirective, MockModule } from 'ng-mocks'
import { IconDirective } from '@coreui/icons-angular';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'
import { By } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { NGXLoggerMock } from 'ngx-logger/testing';
import { of } from 'rxjs'
import { ControlErrorsComponent } from '../../app/utility/control-errors/control-errors.component'
import { updateTrigger } from '../test-util/update-form-helper'
import { addressLine1, firstName, lastName, email, message, phone } from './dummy-data'

describe('Landing Page - Contact Form', () => {
    let fixture: ComponentFixture<LandingComponent>;
    let component: LandingComponent;
    let debugElement: DebugElement;
    let contactFormService: jasmine.SpyObj<ContactFormService>

    const fillForm = () => {
        updateTrigger(fixture, 'first_name', firstName)
        updateTrigger(fixture, 'last_name', lastName)
        updateTrigger(fixture, 'email', email)
        updateTrigger(fixture, 'phone', phone)
        updateTrigger(fixture, 'address_line1', addressLine1)
        updateTrigger(fixture, 'address_line2', addressLine1)
        updateTrigger(fixture, 'message', message)
    }

    beforeEach(() => {
        contactFormService = jasmine.createSpyObj<ContactFormService>('ContactFormSetvice', {
                submitContactForm: of(new SubmitFormResult(true, null)),
                submitRecaptcha: of(1),
                getToken: of("abc")
            }
        )

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, RecaptchaModule, HttpClientTestingModule, MockModule(CarouselModule), ReactiveFormsModule,
                MockModule(BrowserAnimationsModule), ControlErrorsComponent, FormControlDirective, FaIconComponent, ButtonModule, ModalModule],
            declarations: [LandingComponent,
                MockComponent(HeaderComponent),
                MockComponent(FooterComponent),
                MockDirective(IconDirective)],
            providers: [{ provide: ContactFormService, useValue: contactFormService }, { provide: NGXLogger, useClass: NGXLoggerMock },
                AnimationBuilderService, AnimationService, CarouselService, ReCaptchaV3Service, provideAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(LandingComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

    })

    it('Don\'t submit invalid form', fakeAsync(() => {
        let submit =  debugElement.query(By.css(`[data-testid="submit-button"]`));
        expect(submit.nativeElement.disabled).toBeTruthy()
        submit.triggerEventHandler('click', null)
        expect(contactFormService.submitContactForm).not.toHaveBeenCalled();
        expect(component.status).toBe("Idle")
        flush();
    }))

    it('Successful form submission', fakeAsync(() => {
        let submit =  debugElement.query(By.css(`[data-testid="submit-button"]`));

        fillForm()
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        expect(submit.nativeElement.disabled).toBeFalse()

        submit.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        expect(contactFormService.submitRecaptcha).toHaveBeenCalled();
        expect(contactFormService.submitContactForm).toHaveBeenCalled();
        expect(component.status).toBe("Success")
        flush()
    }))

    it('Invalid username feedback', fakeAsync(() => {
        //set recaptcha valid
        updateTrigger(fixture, 'first_name', 'B!lly')
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        let errors = debugElement.query(By.css(`[data-testid="first-name-errors"]`));
        expect(errors.nativeElement.innerText.includes('Letters only')).toBe(true)
    }))

    it('Successful submission popup', fakeAsync(() => {
        let submit =  debugElement.query(By.css(`[data-testid="submit-button"]`));

        fillForm()
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        submit.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        let modalText = debugElement.query(By.css(`[data-testid="modal"]`)).nativeElement.innerText
        expect(modalText.includes('Thank You')).toBe(true)
        flush()
    }))

    it('Unsuccessful submission popup', fakeAsync(() => {
        contactFormService.submitContactForm.and.throwError('server error')
        let submit =  debugElement.query(By.css(`[data-testid="submit-button"]`));

        fillForm()
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        submit.triggerEventHandler('click', null)
        tick(ASYNC_DELAY)
        fixture.detectChanges()

        let modalText = debugElement.query(By.css(`[data-testid="modal"]`)).nativeElement.innerText
        expect(modalText.includes('Submission Error')).toBe(true)
        flush()
    }))
});
