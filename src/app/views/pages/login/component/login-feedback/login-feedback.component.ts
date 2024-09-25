import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective } from '@coreui/angular'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

export enum Status {
    Idle = 'Idle',
    Success = 'Success',
    Invalid = 'Invalid',
    Error = 'Error'
}

@Component({
  selector: 'login-feedback',
  standalone: true,
    imports: [
        ButtonCloseDirective,
        ButtonDirective,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgIf,
        RouterLink,
    ],
  templateUrl: './login-feedback.component.html',
  styleUrl: './login-feedback.component.scss'
})
export class LoginFeedbackComponent  {
    @Input() visible: boolean;
    @Input() status: Status
    @Output() changeVisible: EventEmitter<boolean> = new EventEmitter();
    readonly faCircleExclamation = faCircleExclamation

    constructor(){
        this.visible = false;
        this.status = Status.Idle;
    }

    hideFeedback() {
        this.changeVisible.emit(false);
    }

    /*
     Required for c-modal element
     event: true when modal switched from invisible to visible
     false when modal switched from visible to invisible
     can be used for other events etc
     */
    handleChange(event: boolean) {
        //
    }
}
