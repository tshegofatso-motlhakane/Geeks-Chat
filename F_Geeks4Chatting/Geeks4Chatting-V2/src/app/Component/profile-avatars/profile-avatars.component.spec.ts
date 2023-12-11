import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAvatarsComponent } from './profile-avatars.component';

describe('ProfileAvatarsComponent', () => {
  let component: ProfileAvatarsComponent;
  let fixture: ComponentFixture<ProfileAvatarsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileAvatarsComponent]
    });
    fixture = TestBed.createComponent(ProfileAvatarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
