
import { HttpResponse } from '@angular/common/http'
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { CarouselModule } from '@coreui/angular'
import { HeaderComponent } from 'src/app/views/pages/landing/header/header.component'
import { RecaptchaModule } from 'ng-recaptcha'
import { FooterComponent } from 'src/app/views/pages/landing/footer/footer.component'
import { LandingComponent } from 'src/app/views/pages/landing/landing.component';
import { AnimationBuilderService } from 'src/app/views/pages/landing/service/animation-builder.service'
import { AnimationService } from 'src/app/views/pages/landing/service/animation.service'
import { CarouselService } from 'src/app/views/pages/landing/service/carousel.service'
import { ContactFormService } from 'src/app/views/pages/landing/service/contact-form.service';
import { MockComponent, MockDirective, MockModule } from 'ng-mocks'
import { IconDirective } from '@coreui/icons-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { NGXLoggerMock } from 'ngx-logger/testing';
import { of } from 'rxjs'

xdescribe('Contact Form ReCaptcha', () => {
    let fixture: ComponentFixture<LandingComponent>;
    let component: LandingComponent;
    let debugElement: DebugElement;

    //
    let scoreResponse: JSON;
    let score: any = {"score":"0.7"}
    scoreResponse = <JSON>score;

    const fakeSubmitRecaptcha = jasmine.createSpyObj<ContactFormService>(
        'ContactFormSetvice',
        {
            submitRecaptcha: of(new HttpResponse({body: scoreResponse}))
        }
    )

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, RecaptchaModule, HttpClientTestingModule, MockModule(CarouselModule), ReactiveFormsModule,
                MockModule(BrowserAnimationsModule)],
            declarations: [LandingComponent,
                MockComponent(HeaderComponent),
                MockComponent(FooterComponent),
                MockDirective(IconDirective)],
            providers: [{ provide: ContactFormService, useValue: fakeSubmitRecaptcha }, { provide: NGXLogger, useClass: NGXLoggerMock },
                AnimationBuilderService, AnimationService, CarouselService]
        }).compileComponents();

        fixture = TestBed.createComponent(LandingComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    })

    it('submit is disabled if recapture is invalid', () => {
        let button: HTMLButtonElement =  debugElement.query(By.css(`[data-testid="submit-button"]`)).nativeElement;
        expect(button.disabled).toBeTruthy()
    })

    it('submit is enabled if recapture is valid', () => {
        const submitRecaptcha = spyOn(component, 'submitRecaptcha').and.callThrough();
        let recaptcha =  debugElement.query(By.css(`re-captcha`));
        let button: HTMLButtonElement =  debugElement.query(By.css(`[data-testid="submit-button"]`)).nativeElement;

        recaptcha.triggerEventHandler('resolved', 'my-awesome-token');
        fixture.detectChanges();

        expect(submitRecaptcha).toHaveBeenCalled();
        expect(fakeSubmitRecaptcha.submitRecaptcha).toHaveBeenCalled();
        expect(component.submitRecaptcha).toBeTrue
        expect(button.disabled).toBeFalsy()
    })

    it('displays error message/s if form is invalid', () => {
        //set recaptcha valid
        let recaptcha =  debugElement.query(By.css(`re-captcha`));
        recaptcha.triggerEventHandler('resolved', 'my-awesome-token');
        fixture.detectChanges();

        //assert - set invalid input
        let firstName = debugElement.query(By.css(`[data-testid="first-name-input"]`));
        firstName.nativeElement.value = "   "
        firstName.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        //click submit
        let buttonDebugElement =  debugElement.query(By.css(`[data-testid="submit-button"]`));
        buttonDebugElement.triggerEventHandler('click', null);
        fixture.detectChanges();

        const div =  debugElement.query(By.css(`[data-testid="first-name-invalid-feedback"]`));
        expect(div).toBeTruthy()
        const feedback = div.nativeElement.innerText;
        expect(feedback).toBe("enter first name");
    })

    xit('doesn\'t display error messages if form is valid', () => {
        //set recaptcha valid
        let recaptcha =  debugElement.query(By.css(`re-captcha`));
        recaptcha.triggerEventHandler('resolved', 'my-awesome-token');
        fixture.detectChanges();

        let input = debugElement.queryAll(By.css(`input`));
        input.forEach((debugEl) => {
            let id = debugEl.attributes['id'];

            switch (id) {
                case "first_name":
                    debugEl.nativeNode.value = ""
            }

        })

        expect(true).toBe(true);
    })

    xit('successful form submission', () => {

    })

    xit('invalid form', () => {

    })

    xit('form submission failure', () => {

    })
});
