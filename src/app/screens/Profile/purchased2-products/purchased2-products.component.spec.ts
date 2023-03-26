import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Purchased2ProductsComponent } from './purchased2-products.component';

describe('Purchased2ProductsComponent', () => {
  let component: Purchased2ProductsComponent;
  let fixture: ComponentFixture<Purchased2ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Purchased2ProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Purchased2ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
