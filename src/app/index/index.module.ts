import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { IconDirective } from '@coreui/icons-angular'
import { RecaptchaModule } from 'ng-recaptcha'
import { CopyrightDirective } from './footer/copyright.directive'
import { IndexRoutingModule } from './index-routing.module'
import { IndexComponent } from './index.component'
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { ContactFormService } from './service/contact-form.service'
import { CarouselModule } from '@coreui/angular';

@NgModule({
  declarations: [
    IndexComponent, HeaderComponent, FooterComponent, CopyrightDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RecaptchaModule,
    IndexRoutingModule,
    IconDirective,
    CarouselModule
  ],
  exports: [
    IndexComponent, HeaderComponent, FooterComponent
  ],
  providers: [ContactFormService]
})
export class IndexModule { }
