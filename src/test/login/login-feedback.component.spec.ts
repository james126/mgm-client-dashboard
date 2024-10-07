import { DebugElement } from '@angular/core'
import { ComponentFixture, TestBed} from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { LoginFeedbackComponent, Status } from '../../app/views/pages/login/component/login-feedback/login-feedback.component'

describe('LoginFeedbackComponent', () => {
    let component: LoginFeedbackComponent
    let fixture: ComponentFixture<LoginFeedbackComponent>
    let debugElement: DebugElement

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginFeedbackComponent, RouterModule.forRoot([])],
            providers: [provideAnimations()],
        }).compileComponents()

        fixture = TestBed.createComponent(LoginFeedbackComponent)
        component = fixture.componentInstance
        debugElement = fixture.debugElement
        fixture.detectChanges()
    })

    it('Display invalid username or password', () => {
        component.status = Status.Invalid
        component.visible = true;
        fixture.detectChanges()

        let modalText = debugElement.query(By.css(`[data-testid="login-modal"]`)).nativeElement.innerText
        expect(modalText.includes('Invalid username or password')).toBeTrue()
    })

    it('Display Internal error', () => {
        component.status = Status.Error
        component.visible = true;
        fixture.detectChanges()

        let modalText = debugElement.query(By.css(`[data-testid="login-modal"]`)).nativeElement.innerText
        expect(modalText.includes('Internal error, please try again later')).toBeTrue()
    })
})
