import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { RecaptchaModule } from 'ng-recaptcha'
import { IndexRoutingModule } from './index-routing.module'
import { IndexComponent } from './index.component'
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { ContactFormService } from './service/contact-form.service'

@NgModule({
  declarations: [
    IndexComponent, HeaderComponent, FooterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RecaptchaModule,
    IndexRoutingModule,
  ],
  exports: [
    IndexComponent, HeaderComponent, FooterComponent
  ],
  providers: [ContactFormService]
})
export class IndexModule { }
