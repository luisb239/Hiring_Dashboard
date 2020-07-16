import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsProfilesComponent } from './statistics-profiles.component';

describe('StatisticsProfilesComponent', () => {
  let component: StatisticsProfilesComponent;
  let fixture: ComponentFixture<StatisticsProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
