import { DebugElement } from '@angular/core'
import { ComponentFixture, TestBed} from '@angular/core/testing'
import { provideAnimations } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { SubmitEmailComponent } from '../../app/views/pages/login/component/reset-password/submit-email.component'

describe('LoginFeedbackComponent', () => {
    let component: SubmitEmailComponent
    let fixture: ComponentFixture<SubmitEmailComponent>
    let debugElement: DebugElement

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubmitEmailComponent,RouterModule.forRoot([])],
            providers: [provideAnimations()],
        }).compileComponents()

        fixture = TestBed.createComponent(SubmitEmailComponent)
        component = fixture.componentInstance
        debugElement = fixture.debugElement
        fixture.detectChanges()
    })

    it('Validate email address format', () => {

    })

    it('Submission response successful', () => {

    })

    it('Submission response error', () => {

    })


})
