import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { FormControlDirective, InputGroupComponent } from '@coreui/angular'
import { ControlErrorsComponent } from '../../app/utility/control-errors/control-errors.component'
import { Type } from 'ng-mocks'
const { required } = Validators
import { updateTrigger } from '../test-util/update-form-helper'

describe('ControlErrorsComponent', () => {
    let component: ControlErrorsComponent
    let fixture: ComponentFixture<ControlErrorsComponent>
    let input: HTMLInputElement
    let formBuilder: NonNullableFormBuilder

    const setup = async (HostComponent: Type<any>) => {

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, ControlErrorsComponent, InputGroupComponent, FormControlDirective],
            declarations: [HostComponent]
        }).compileComponents()

        formBuilder = TestBed.inject(NonNullableFormBuilder);
        fixture = TestBed.createComponent(HostComponent)
        fixture.detectChanges()
        input = fixture.debugElement.query(By.css(`input`)).nativeElement
    }

    describe('passing the control', () => {
        @Component({
            template: `
                <!-- USERNAME -->
                <form [formGroup]="register">
                    <c-input-group class="mb-3"> 
                    <span cInputGroupText>
                        <svg cIcon name="cilUser"></svg>
                    </span>
                        <input formControlName="username" cFormControl placeholder="Username" data-testid="username" />
                        <control-errors controlName="username" id="username-errors">
                            <ng-template let-errors>
                                <ng-container *ngIf="errors.required" data-testid="errors.required">
                                    <div>
                                        <span class="control-error-mark">❗</span>
                                        Enter a username
                                    </div>
                                </ng-container>
                            </ng-template>
                        </control-errors>
                    </c-input-group>
                </form>
            `,
        })
        class HostComponent {
        public register
            constructor() {
                this.register = formBuilder.group({
                    username: ['', {
                        validators: [required],
                        updateOn: 'change'
                    }],
                })
            }
        }

        beforeEach(async () => {
            await setup(HostComponent)
        })

        describe('Valid username input', () => {
            it('no errors', () => {
                updateTrigger(fixture, 'username', 'something')
                fixture.detectChanges()
                expect(fixture.nativeElement.textContent).toBe('')
            })
        })

        describe('Invalid username input', () => {
            it('no errors', () => {
                updateTrigger(fixture, 'username', '')
                fixture.detectChanges()
                var a = 'apple';
                var b: string = 'pear'
                expect(fixture.nativeElement.textContent).toBe('❗ Enter a username ')
            })
        })
    })
})


