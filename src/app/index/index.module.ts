import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterLink } from '@angular/router'
import { NavbarTogglerDirective } from '@coreui/angular/lib/navbar/navbar-toggler/navbar-toggler.directive'
import { NavbarComponent } from '@coreui/angular/lib/navbar/navbar.component'
import { IconDirective } from '@coreui/icons-angular'
import { RecaptchaModule } from 'ng-recaptcha'
import { CopyrightDirective } from './footer/copyright.directive'
import { IndexRoutingModule } from './index-routing.module'
import { IndexComponent } from './index.component'
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { LogoComponent } from './logo/logo.component'
import { AnimationService } from './service/animation.service'
import { CustomAnimationBuilderService } from './service/custom-animation-builder.service'
import { ContactFormService } from './service/contact-form.service'
import { CarouselModule, CollapseModule, GridModule, NavbarModule, NavModule } from '@coreui/angular'

@NgModule({
    declarations: [
        IndexComponent, HeaderComponent, FooterComponent, CopyrightDirective, LogoComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        RecaptchaModule,
        IndexRoutingModule,
        IconDirective,
        CarouselModule,
        GridModule,
        NavbarModule,
        NavModule,
        CollapseModule,
        BrowserAnimationsModule,
    ],
    exports: [
        IndexComponent, HeaderComponent, FooterComponent
    ],
    providers: [ContactFormService, CustomAnimationBuilderService, AnimationService]
})
export class IndexModule { }
