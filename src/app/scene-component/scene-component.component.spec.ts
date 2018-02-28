import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneComponentComponent } from './scene-component.component';

describe('SceneComponentComponent', () => {
  let component: SceneComponentComponent;
  let fixture: ComponentFixture<SceneComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
