import { Component, ViewEncapsulation } from '@angular/core'

@Component({
	selector: 'mgm-footer',
	templateUrl: './footer.component.html',
	styles: [
		`#footer {
			position: absolute;
			bottom: 0 !important;
			width: 100%;
			height: 4.5rem; /* Footer height */
		}`
	],
	styleUrls: [
		// '../../../assets/index/css/google-web-font.css',
		// '../../../assets/index/lib/animate/animate.min.css',
		// '../../../assets/index/css/bootstrap.min.css',
		// '../../../assets/index/css/style2.css'
	],
	encapsulation: ViewEncapsulation.Emulated
})
export class FooterComponent {
}
