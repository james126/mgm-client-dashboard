import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";

@Component({
	selector: 'mgm-header',
	templateUrl: './header.component.html',
	styleUrls: [
		'../../../assets/index//css/google-web-font.css',
		'../../../assets/index/lib/animate/animate.min.css',
		'../../../assets/index/css/bootstrap.min.css',
		'../../../assets/index/css/style2.css'
	],
	// encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent {
	@Input() currentRoute: String = '';

	constructor(public router: Router) {
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
