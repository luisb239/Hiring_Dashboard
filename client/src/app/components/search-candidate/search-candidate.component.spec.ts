import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchCandidateComponent} from './search-candidate.component';

describe('SearchCandidateComponent', () => {
  let component: SearchCandidateComponent;
  let fixture: ComponentFixture<SearchCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchCandidateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
