import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { NpvServiceService } from './npv-service.service';
import { RequestModel } from '../models/request.model';
import { ResultModel } from '../models/result.model';

describe('NpvServiceService', () => {
  let npvService: NpvServiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NpvServiceService],
    });

    npvService = TestBed.inject(NpvServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(npvService).toBeTruthy();
  });

  it('should post data and return ResultModel array', () => {
    const request: RequestModel = generateRequestData();
    const expectedResult: ResultModel[] = generateExpectedResult();

    npvService.postData(request).subscribe((result: ResultModel[]) => {
      expect(result).toEqual(expectedResult);
    });

    const req = httpTestingController.expectOne(
      'https://localhost:7284/calculatenpv'
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(request);

    req.flush(expectedResult);
  });

  function generateRequestData(): RequestModel {
    return {
      InitialInvestment: 1000000,
      Lower: 0.01,
      Upper: 0.1,
      RateIncrement: 0.01,
      CashFlows: [200000, 300000, 400000, 500000],
    };
  }

  function generateExpectedResult(): ResultModel[] {
    return [
      {
        rate: 1,
        npv: 9317.14,
      },
      {
        rate: 1.25,
        npv: 9151.65,
      },
      {
        rate: 1.5,
        npv: 8988.18,
      },
      {
        rate: 1.75,
        npv: 8826.7,
      },
      {
        rate: 2,
        npv: 8667.19,
      },
      {
        rate: 2.25,
        npv: 8509.61,
      },
      {
        rate: 2.5,
        npv: 8353.94,
      },
      {
        rate: 2.75,
        npv: 8200.14,
      },
      {
        rate: 3,
        npv: 8048.19,
      },
      {
        rate: 3.25,
        npv: 7898.06,
      },
      {
        rate: 3.5,
        npv: 7749.72,
      },
      {
        rate: 3.75,
        npv: 7603.15,
      },
      {
        rate: 4,
        npv: 7458.31,
      },
      {
        rate: 4.25,
        npv: 7315.2,
      },
      {
        rate: 4.5,
        npv: 7173.76,
      },
      {
        rate: 4.75,
        npv: 7034,
      },
      {
        rate: 5,
        npv: 6895.87,
      },
    ];
  }
});
