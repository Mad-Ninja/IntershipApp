import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ICurrency } from 'src/app/models/currency';

import { BudgetifyService } from 'src/app/budgetify/services/budgetify.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
 




  isAccountInfo!: boolean;
  accountInfoTitle!: string;
  accountInfoBalance!: number;
  accountInfoCurrency!: string;
  accountInfoDescription!: string;
  isAccountAdd!: boolean;

  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(
    private budgetifyService: BudgetifyService,
    private http: HttpClient
  ) {}

  changeSidenavContent(target: string) {
    if (target === 'isAccountAdd') {
      this.isAccountAdd = true;
      this.isAccountInfo = false;
    } else if (target === 'isAccountInfo') {
      this.isAccountInfo = true;
      this.isAccountAdd = false;
    }
  }
  closeSidenav() {
    this.componentMethodCallSource.next(void 0);
  }

  addAccount(title: string, curr: ICurrency, description: string) {
    const account = {
      name: title,
      currency: curr,
      description: description,
    };
    return this.http.post('http://localhost:3000/accounts', account);
  }
}
