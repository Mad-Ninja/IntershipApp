import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { CardService } from '../card/services/card.service';
import { SidenavService } from './services/sidenav.service';
import { BudgetifyService } from '../../services/budgetify.service';
import { AddBtnService } from '../add-button/services/add-btn.service';
import { MatDialog } from '@angular/material/dialog';
import { ICard } from 'src/app/models/cards';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  buttonCategTypeValueControl = new FormControl('expense');

  @ViewChild('formAddAccount') public formAA: any;

  addAccountForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(128),
      this.titleCardsUniqValidator.bind(this),
      this.noWhitespaceValidator,
    ]),
    currency: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.maxLength(256)]),
  });

  editAccountForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(128),
      this.titleCardsUniqValidator.bind(this),
      this.noWhitespaceValidator,
    ]),
    currency: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.maxLength(256)]),
  });

  addCategoryForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(128),
      this.sidenavService.titleCategoriesUniqValidation.bind(this),
      this.noWhitespaceValidator,
    ]),
  });

  get title1() {
    return this.addAccountForm.get('title');
  }
  get description1() {
    return this.addAccountForm.get('description');
  }
  get title2() {
    return this.editAccountForm.get('title');
  }
  get description2() {
    return this.editAccountForm.get('description');
  }
  get titleCat() {
    return this.addCategoryForm.get('title');
  }

  constructor(
    public budgetifyService: BudgetifyService,
    public sidenavService: SidenavService,
    private cardService: CardService,
    private addBtnService: AddBtnService,
    public dialog: MatDialog
  ) {
    this.addBtnService.componentMethodCalled$.subscribe(() => {
      this.addAccountForm.patchValue({
        currency: this.budgetifyService.currentUserCurrenceCode,
      });
    });
  }
  openDialog() {
    this.dialog.open(Popup);
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  titleCardsUniqValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const title = control.value;
    if (
      title?.toLowerCase() ===
      this.sidenavService.accountInfoTitle?.toLocaleLowerCase()
    ) {
      return null;
    }
    const isTitleExist = this.cardService.accountCards.some(
      (card: ICard) => card.name?.toLowerCase() === title?.toLowerCase()
    );
    return isTitleExist ? { uniqTitle: true } : null;
  }

  onSaveAccount() {
    const { title, currency, description } = this.addAccountForm.value;
    const curr = this.budgetifyService.currenciesMy.filter(
      (obj) => obj.code === currency
    )[0];
    this.sidenavService.addAccount(title, curr, description).subscribe(
      (data) => {
        this.sidenavService.closeSidenav();
        this.sidenavService.showToast('Account succesfuly created');
        this.cardService.getAccounts();
      },
      (error) => {}
    );
  }

  editAccountButton() {
    this.editAccountForm.patchValue({
      title: this.sidenavService.accountInfoTitle,
      currency: this.sidenavService.accountInfoCurrencyCode,
      description: this.sidenavService.accountInfoDescription,
    });
    this.sidenavService.changeSidenavContent('isAccountEdit');
  }

  onEditAccount() {
    const accountId = this.cardService.accountSelectedID;
    const { title, currency, description } = this.editAccountForm.value;
    const curr = this.budgetifyService.currenciesMy.filter(
      (obj) => obj.code === currency
    )[0];
    this.sidenavService
      .editAccount(title, curr, description, accountId)
      .subscribe(
        (data) => {
          this.sidenavService.closeSidenav();
          this.sidenavService.showToast('Account succesfuly edited');
          this.cardService.getAccounts();
        },
        (error) => {}
      );
  }

  onAddCategory() {
    const { title } = this.addCategoryForm.value;
    const catType = this.buttonCategTypeValueControl.value;
    this.sidenavService.addCategory(title, catType).subscribe(
      (data) => {
        this.sidenavService.closeSidenav();
        this.budgetifyService
          .getUserData(localStorage.getItem('id')!)
          .subscribe(
            (data) => {},
            (error) => {}
          );
        this.sidenavService.showToast('Category succesfuly created');
      },
      (error) => {}
    );
  }

  ngOnInit(): void {}
}

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class Popup {
  constructor(
    public dialog: MatDialog,
    public sidenavService: SidenavService,
    private cardService: CardService
  ) {}
  closeDialog() {
    this.dialog.closeAll();
  }
  yesBtnClick() {
    if (this.sidenavService.popupTitle === 'Delete account') {
      this.onDeleteAccount();
    }
  }
  onDeleteAccount() {
    const accountId = this.cardService.accountSelectedID;
    if (this.cardService.selectedIndex === 0) {
      this.cardService.selectedIndex = 0;
    } else {
      this.cardService.selectedIndex--;
    }
    this.sidenavService.deleteAccount(accountId).subscribe((data) => {
      this.sidenavService.closeSidenav();
      this.sidenavService.showToast('Account succesfuly deleted');
      this.cardService.getAccounts();
    });
  }
}
