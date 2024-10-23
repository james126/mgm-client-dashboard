import { Component, Input} from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'mgm-header',
    templateUrl: './header.component.html',
    styles: [`
      #get-started-link {
        color: rgba(218,165,32) !important;
      };
      #get-started-link:hover {
        color: rgba(243,189,0) !important;
      };
      #home-link:hover {
        color: rgba(218,165,32) !important;
      }
    `],
})
export class HeaderComponent {
    @Input() currentRoute: String = ''

    constructor() {
    }

    // logout() {
    // 	this.logoutService.logout().subscribe({
    // 		next: (data) => {
    // 			this.router.navigate(["/"], { skipLocationChange: true });
    // 		},
    // 		error: (err) => { }
    // 	})
    // }
}
