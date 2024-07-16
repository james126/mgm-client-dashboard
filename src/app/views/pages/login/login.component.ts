import { Component, ViewChild } from '@angular/core'
import { NgStyle } from '@angular/common'
import { IconDirective } from '@coreui/icons-angular'
import {
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    ButtonDirective,
} from '@coreui/angular'
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha'
import { environment } from '../../../../environments/environment'
import { LoginService } from './login.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    // styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
        InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, RecaptchaModule],
    providers: [LoginService]
})
export class LoginComponent {
    @ViewChild('recaptcha', { static: false, read: RecaptchaComponent }) repactcha?: RecaptchaComponent
    captchaResponse: boolean = false
    siteKey: string = environment.contactFormSiteKey

    formValues = {
        username: '',
        email: '',
        password: '',
    }

    constructor(private service: LoginService) {
    }

    submitCaptcha(response: any) {
        //timeout or repactcha.reset() produces a null response
        if (response == null) {
            this.captchaResponse = false
        } else {
            this.service.submitRecaptcha(response).subscribe({
                next: (data) => {
                    this.captchaResponse = true
                }, error: (err) => {
                    //allow form submission anyway - errors are logged in ContactFormService
                    this.captchaResponse = true
                },
            })
        }
    }

}

