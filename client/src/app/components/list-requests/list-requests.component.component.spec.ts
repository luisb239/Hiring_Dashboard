import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequests.ComponentComponent } from './list-requests.component';

describe('ListRequests.ComponentComponent', () => {
  let component: ListRequests.ComponentComponent;
  let fixture: ComponentFixture<ListRequests.ComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRequests.ComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRequests.ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
