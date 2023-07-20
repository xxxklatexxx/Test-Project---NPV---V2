import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NpvServiceService } from './services/npv-service.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockNpvService: jasmine.SpyObj<NpvServiceService>;

  beforeEach(waitForAsync(() => {
    // Create a mock NpvServiceService
    const npvServiceSpy = jasmine.createSpyObj('NpvServiceService', [
      'postData',
    ]);
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: NpvServiceService, useValue: npvServiceSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    mockNpvService = TestBed.inject(
      NpvServiceService
    ) as jasmine.SpyObj<NpvServiceService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cashFlows array with request.CashFlows', () => {
    expect(component.cashFlows).toEqual(component.request.CashFlows);
  });

  it('should add a cash flow when calling AddCashFlow()', () => {
    const initialLength = component.request.CashFlows.length;
    component.AddCashFlow();
    expect(component.request.CashFlows.length).toBe(initialLength + 1);
    expect(component.cashFlows.length).toBe(initialLength + 1);
  });

  it('should remove a cash flow when calling RemoveCashFlow()', () => {
    const initialLength = component.request.CashFlows.length;
    component.RemoveCashFlow();
    expect(component.request.CashFlows.length).toBe(initialLength - 1);
    expect(component.cashFlows.length).toBe(initialLength - 1);
  });

  it('should update cash flow when calling updateCashFlow()', () => {
    const newValue = 1234;
    const indexToUpdate = 1;
    const inputElement = document.createElement('input');
    inputElement.value = String(newValue);
    const event = new CustomEvent('input', { bubbles: true });
    Object.defineProperty(event, 'target', {
      writable: false,
      value: inputElement,
    });

    component.updateCashFlow(event, indexToUpdate);

    expect(component.request.CashFlows[indexToUpdate]).toBe(newValue);
  });

  it('should call calculateNpv() when clicking "Calculate NPV" button', () => {
    spyOn(component, 'calculateNpv');
    const calculateButton = fixture.nativeElement.querySelector('#calculateNpv');
    calculateButton.click();
    expect(component.calculateNpv).toHaveBeenCalled();
  });

  it('should call service postData method and update result on calculateNpv()', () => {
    const mockResult = [{ rate: 1, npv: 100 }];
    mockNpvService.postData.and.returnValue(of(mockResult));

    component.calculateNpv();

    expect(mockNpvService.postData).toHaveBeenCalledWith(component.request);
    expect(component.result).toEqual(mockResult);
  });

  it('should create a Chartist.LineChart on calculateNpv()', () => {
    const mockResult = [{ rate: 1, npv: 100 }];
    mockNpvService.postData.and.returnValue(of(mockResult));

    component.calculateNpv();

    expect(component.chart).toBeTruthy();
  });

  // Additional test cases for other scenarios can be added here
});
