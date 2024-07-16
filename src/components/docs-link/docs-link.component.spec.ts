import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsLinkComponent } from './docs-link.component';

xdescribe('DocsLinkComponent', () => {
  let component: DocsLinkComponent;
  let fixture: ComponentFixture<DocsLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DocsLinkComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
