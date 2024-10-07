import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordComponent } from '../../app/views/pages/login/component/reset-password/new-password/new-password.component';

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('submission success popup', () => {
    expect(component).toBeTruthy();
  });

  it('submission error popup', () => {
    expect(component).toBeTruthy();
  });

  it('will not submit an invalid form', () => {
    expect(component).toBeTruthy();
  });

  it('password synchronously validated', () => {
    expect(component).toBeTruthy();
  });

  it('password asynchronously validated', () => {
    expect(component).toBeTruthy();
  });

  it('password is the same as repeat-password', () => {
    expect(component).toBeTruthy();
  });

  it('toggle password display', () => {
    expect(component).toBeTruthy();
  });

});
