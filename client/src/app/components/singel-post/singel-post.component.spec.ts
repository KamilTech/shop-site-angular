import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingelPostComponent } from './singel-post.component';

describe('SingelPostComponent', () => {
  let component: SingelPostComponent;
  let fixture: ComponentFixture<SingelPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingelPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingelPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
