import { ComponentFixture } from '@angular/core/testing'
import { ValidationErrors } from '@angular/forms'
import { By } from '@angular/platform-browser'
import _default from 'chart.js/dist/plugins/plugin.tooltip'
import { RegisterComponent } from '../../app/views/pages/register/register.component'

export function updateTrigger(fixture: ComponentFixture<RegisterComponent>, id: string, value: string): void {
    let el = fixture.debugElement.query(By.css(`[data-testid="${id}"]`))
    el.nativeElement.value = value;
    const event = {
        preventDefault(): void {},
        stopPropagation(): void {},
        stopImmediatePropagation(): void {},
        type: 'input',
        target: el.nativeElement,
        currentTarget: el.nativeElement,
        bubbles: false,
        cancelable: false,
        button: 0,
    };
    el.triggerEventHandler('input', event);
    //validation updateOn blur
    dispatchFakeEvent(fixture, id);
}

export function dispatchFakeEvent(fixture: ComponentFixture<RegisterComponent>, id: string,): void {
    let el = fixture.debugElement.query(By.css(`[data-testid="${id}"]`))
    const event = {
        preventDefault(): void {},
        stopPropagation(): void {},
        stopImmediatePropagation(): void {},
        type: 'blur',
        target: el.nativeElement,
        currentTarget: el.nativeElement,
        bubbles: false,
        cancelable: false,
        button: 0,
    };
    el.triggerEventHandler('blur', event);
}

export function formatErrors(arr: Array<string>): ValidationErrors {
    const errors: ValidationErrors = {}

    arr.forEach((err:string) => {
        switch (err){
            case 'invalidPassword':
                errors['invalidPassword'] = true;
                break;
            case 'requiresUppercase':
                errors['requiresUppercase'] = true;
                break;
            case 'requiresLowercase':
                errors['requiresLowercase'] = true;
                break;
            case 'requiresNumeric':
                errors['requiresNumeric'] = true;
                break;
            case 'requiresSpecial':
                errors['requiresSpecial'] = true;
                break;
        }
    })

    return errors
}
