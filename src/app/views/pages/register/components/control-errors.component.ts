import { CommonModule, } from '@angular/common'
import { AfterContentInit, Component, ContentChild, Input, OnDestroy, OnInit, Optional, TemplateRef } from '@angular/core'
import { AbstractControl, ControlContainer, ValidationErrors } from '@angular/forms'
import { findFormControl } from '../util/findFormControl';
import { Subscription, startWith, timer } from 'rxjs'

@Component({
  selector: 'control-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-errors.component.html',
  styleUrl: './control-errors.component.scss'
})
export class ControlErrorsComponent implements OnInit, AfterContentInit, OnDestroy{
  public control?: AbstractControl;

  @Input()
  public controlName?: string;

  private subscription?: Subscription;

  public errorMessages: ValidationErrors = {
    $implicit: {},
  };

  //ContentChild(TemplateRef)
  //get the first element of type TemplateRef(<ng-template>) from the content DOM (DOM between this elements opening and closing tag)
  @ContentChild(TemplateRef)
  template!: TemplateRef<any> | null;

  //using [formGroup]="register" we can inject ControlContainer
  constructor(@Optional() private controlContainer?: ControlContainer) {

  }

  ngOnInit(): void {
    this.control = findFormControl(
        this.controlName,
        this.controlContainer,
    );
  }

  ngAfterContentInit(): void {
    //valid and invalid set initially or after pending (validation in progress)
    this.subscription = this.control?.statusChanges.pipe(startWith('VALID', 'INVALID')).subscribe(() => {
      this.getErrorMessages();
    });
  }

  private getErrorMessages(): void {
    if (this.control?.errors){
      this.errorMessages = {
        $implicit: this.control.errors
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
