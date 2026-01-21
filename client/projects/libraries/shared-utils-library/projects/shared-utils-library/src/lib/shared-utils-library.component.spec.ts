import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUtilsLibraryComponent } from './shared-utils-library.component';

describe('SharedUtilsLibraryComponent', () => {
  let component: SharedUtilsLibraryComponent;
  let fixture: ComponentFixture<SharedUtilsLibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedUtilsLibraryComponent]
    });
    fixture = TestBed.createComponent(SharedUtilsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
