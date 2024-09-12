import { Component, Input, OnInit } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

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
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'mr grass master';

  constructor(private router: Router, private titleService: Title, private iconSetService: IconSetService) {
    this.titleService.setTitle(this.title);
    this.iconSetService.icons = { ...iconSubset };
    this.router.navigate(['/login'])
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
