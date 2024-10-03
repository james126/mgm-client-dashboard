import { Component, importProvidersFrom, OnInit } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { IconSetService } from '@coreui/icons-angular';
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { iconSubset } from './icons/icon-subset';
import { LoginService } from './views/pages/login/service/login.service'
import { SignupService } from './views/pages/register/service/signup.service'

export interface InputConfig {
  usernameMaxLength:  number,
  usernameMinLength: number,
  passwordMaxLength: number,
  passwordMinLength: number,
  emailMaxLength: number

}

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  standalone: true,
  imports: [RouterOutlet],
  providers: [LoginService, SignupService, ReCaptchaV3Service],
})
export class AppComponent implements OnInit {
  title = 'mr grass master';

  constructor(private router: Router, private titleService: Title, private iconSetService: IconSetService) {
    this.titleService.setTitle(this.title);
    this.iconSetService.icons = { ...iconSubset };
    // this.router.navigate(['/login'])
    // this.router.navigate(['/landing'], { skipLocationChange: true })
    //     .then(r => true );
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
