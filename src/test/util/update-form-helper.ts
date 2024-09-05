import { ComponentFixture } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

export function updateTrigger(fixture: ComponentFixture<any>, id: string, value: string): void {
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

export function dispatchFakeEvent(fixture: ComponentFixture<any>, id: string,): void {
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
