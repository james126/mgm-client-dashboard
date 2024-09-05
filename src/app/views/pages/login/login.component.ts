import { Component } from '@angular/core'
import { NgStyle } from '@angular/common'
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterModule } from '@angular/router'
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

const { email, maxLength, minLength, pattern, required } = Validators
export const ASYNC_DELAY = 1000

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
        InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, RouterModule, ReactiveFormsModule],
})
export class LoginComponent {
    public login: FormGroup
    public show1: boolean

    constructor(private formBuilder: NonNullableFormBuilder,) {
        this.login = this.formBuilder.group({
            username: ['', {
                validators: [required, pattern('[a-zA-Z0-9.]+'), maxLength(20), minLength(5)],
                updateOn: 'blur',
            }],

            password: ['', {
                validators: [required, maxLength(20), minLength(10)],
                updateOn: 'blur',
            }],
        })

        this.show1 = false
    }

    public togglePass() {
        this.show1 = !this.show1
    }
}
