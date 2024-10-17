import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterLink } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'
import { IconDirective } from '@coreui/icons-angular'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha'
import { ControlErrorsComponent } from '../../../utility/control-errors/control-errors.component'
import { CopyrightDirective } from './footer/copyright.directive'
import { LandingRoutingModule } from './landing-routing.module'
import { LandingComponent } from './landing.component'
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { LogoComponent } from './logo/logo.component'


import {
    ButtonCloseDirective,
    ButtonDirective,
    CarouselModule,
    CollapseModule,
    FormControlDirective,
    GridModule,
    ModalModule,
    NavbarModule,
    NavModule,
} from '@coreui/angular'
import { AnimationBuilderService } from './service/animation-builder.service'
import { AnimationService } from './service/animation.service'
import { CarouselService } from './service/carousel.service'
import { ContactFormService } from './service/contact-form.service'

@NgModule({
    declarations: [
        LandingComponent, HeaderComponent, FooterComponent, CopyrightDirective, LogoComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        RecaptchaModule,
        LandingRoutingModule,
        IconDirective,
        CarouselModule,
        GridModule,
        NavbarModule,
        NavModule,
        CollapseModule,
        BrowserAnimationsModule,
        NgOptimizedImage,
        ControlErrorsComponent,
        FormControlDirective,
        ButtonCloseDirective,
        ButtonDirective,
        FaIconComponent,
        ModalModule
    ],
    exports: [
        LandingComponent, HeaderComponent, FooterComponent
    ],
    providers: [ContactFormService, CarouselService, AnimationBuilderService, AnimationService, ReCaptchaV3Service ]
})
export class LandingModule { }
