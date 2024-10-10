import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { DefaultLogoComponent } from './default-logo/default-logo.component'
import { IconDirective } from '@coreui/icons-angular';
import {
    ButtonDirective, ColComponent,
    ContainerComponent, FormControlDirective, InputGroupComponent, InputGroupTextDirective, RowComponent,
    ShadowOnScrollDirective,
    SidebarBrandComponent,
    SidebarComponent,
    SidebarFooterComponent,
    SidebarHeaderComponent,
    SidebarNavComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
} from '@coreui/angular'

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
    imports: [
        SidebarComponent,
        SidebarHeaderComponent,
        SidebarBrandComponent,
        RouterLink,
        IconDirective,
        NgScrollbar,
        SidebarNavComponent,
        SidebarFooterComponent,
        SidebarToggleDirective,
        SidebarTogglerDirective,
        DefaultHeaderComponent,
        ShadowOnScrollDirective,
        ContainerComponent,
        RouterOutlet,
        DefaultFooterComponent,
        DefaultLogoComponent,
        ButtonDirective,
        ColComponent,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        RowComponent,
    ],
})
export class DefaultLayoutComponent {
  public navItems = navItems;

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
