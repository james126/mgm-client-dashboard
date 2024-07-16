import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterLink } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'
import { IconDirective } from '@coreui/icons-angular'
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha'
import { CopyrightDirective } from './footer/copyright.directive'
import { IndexRoutingModule } from './index-routing.module'
import { IndexComponent } from './index.component'
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { LogoComponent } from './logo/logo.component'
import { CarouselModule, CollapseModule, GridModule, NavbarModule, NavModule } from '@coreui/angular'
import { AnimationBuilderService } from './service/animation-builder.service'
import { AnimationService } from './service/animation.service'
import { CarouselService } from './service/carousel.service'
import { ContactFormService } from './service/contact-form.service'
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [
        IndexComponent, HeaderComponent, FooterComponent, CopyrightDirective, LogoComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        RecaptchaModule,
        RecaptchaFormsModule,
        IndexRoutingModule,
        IconDirective,
        CarouselModule,
        GridModule,
        NavbarModule,
        NavModule,
        CollapseModule,
        BrowserAnimationsModule,
        NgOptimizedImage
    ],
    exports: [
        IndexComponent, HeaderComponent, FooterComponent
    ],
    providers: [ContactFormService, CarouselService, AnimationBuilderService, AnimationService, {
        provide: RECAPTCHA_SETTINGS,
        useValue: { siteKey: environment.contactFormSiteKey, theme: "dark" } as RecaptchaSettings
    }]
})
export class IndexModule { }
