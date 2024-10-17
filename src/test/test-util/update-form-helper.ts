import { ComponentFixture } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

export function updateTrigger(fixture: ComponentFixture<any>, id: string, value: string): void {
    let el = fixture.debugElement.query(By.css(`[data-testid="${id}"]`))
    el.nativeElement.value = value;
    const event = {
        preventDefault(): void {},
        stopPropagation(): void {},
        stopImmediatePropagation(): void {},
        type: 'change',
        target: el.nativeElement,
        currentTarget: el.nativeElement,
        bubbles: false,
        cancelable: false,
        button: 0,
    };
    el.triggerEventHandler('change', event);
    // el.nativeElement.dispatchEvent(new Event('change'));
    //validation updateOn
    dispatchFakeInputEvent(fixture, id);
}

/*
 Subscription are being triggered by focus events
 */
export function dispatchFocusEvent(fixture: ComponentFixture<any>, id: string,): void {
    let el = fixture.debugElement.query(By.css(`[data-testid="${id}"]`))
    const event = {
        preventDefault(): void {},
        stopPropagation(): void {},
        stopImmediatePropagation(): void {},
        type: 'focus',
        target: el.nativeElement,
        currentTarget: el.nativeElement,
        bubbles: false,
        cancelable: false,
        button: 0,
    };
    el.triggerEventHandler('focus', event);
    el.nativeElement.dispatchEvent(new Event('focus'));
}

export function dispatchFakeInputEvent(fixture: ComponentFixture<any>, id: string,): void {
    let el = fixture.debugElement.query(By.css(`[data-testid="${id}"]`))
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
}
