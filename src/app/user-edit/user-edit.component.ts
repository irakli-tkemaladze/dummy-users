import { Component, inject } from '@angular/core';
import { UsersService } from '../users.service';
import { FormsModule } from '@angular/forms';
import { ProxyService } from '../proxy.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  imports: [FormsModule, NgClass],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  userService = inject(UsersService);
  http = inject(ProxyService);
  enteredInputData: { email: string; firstName: string; lastName: string } = {
    email: this.userService.markedUser()?.email ?? '',
    firstName: this.userService.markedUser()?.username ?? '',
    lastName: this.userService.markedUser()?.lastName ?? '',
  };
  formValidation: {
    isEmailValid: boolean;
    isNameValid: boolean;
    isLastNameValid: boolean;
  } = {
    isEmailValid: true,
    isNameValid: true,
    isLastNameValid: true,
  };
  onCancel() {
    if (
      (!this.enteredInputData.email.trim() ||
        this.enteredInputData.email === this.userService.markedUser()?.email) &&
      (!this.enteredInputData.lastName.trim() ||
        this.enteredInputData.lastName ===
          this.userService.markedUser()?.lastName) &&
      (!this.enteredInputData.firstName.trim() ||
        this.enteredInputData.firstName ===
          this.userService.markedUser()?.username)
    ) {
      this.userService.isEditUserClicked.set(false);
    } else {
      const confirm = window.confirm(
        'გათიშვლის შემთხვევაში შევსებულ მონაცემები დაიკარგება, ნამდვილად გსურს ცვლილების შეწყვეტა?'
      );
      if (confirm) {
        this.userService.isEditUserClicked.set(false);
      }
    }
  }
  inFormClick(e: Event) {
    e.stopPropagation();
  }
  onBtnAddClick() {
    if (
      this.enteredInputData.email === this.userService.markedUser()?.email &&
      this.enteredInputData.firstName ===
        this.userService.markedUser()?.username &&
      this.enteredInputData.lastName === this.userService.markedUser()?.lastName
    ) {
      const confirm = window.confirm(
        'მონაცემები იდენტურია, გავთიშო რედაქტირების ფანჯარა?'
      );
      if (confirm) {
        this.onCancel();
      }
    } else {
      this.formValidation = {
        isEmailValid:
          this.enteredInputData.email.includes('@') &&
          this.enteredInputData.email.includes('.'),
        isNameValid: this.enteredInputData.firstName.trim() !== '',
        isLastNameValid: this.enteredInputData.lastName.trim() !== '',
      };
      if (
        this.formValidation.isEmailValid &&
        this.formValidation.isLastNameValid &&
        this.formValidation.isNameValid
      ) {
        this.http
          .PutUserService(
            this.userService.markedUser()?.id as number,
            this.enteredInputData
          )
          .subscribe({
            next: (res) => {
              console.log(res);
            },
            complete: () => {
              this.userService.popupIcon.set('check_small.png');
              this.userService.popupText.set('მოქმედება წარმატებით შესრულდა');
              this.userService.fetchingDataEnd.set(true);
              this.userService.isEditUserClicked.set(false);
              this.userService.isError.set(false);
            },
            error: (err: Error) => {
              this.userService.isEditUserClicked.set(false);
              this.userService.popupIcon.set('exclamation.png');
              this.userService.popupText.set('მოქმედება ვერ შესრულდა');
              this.userService.fetchingDataEnd.set(true);
              this.userService.isError.set(true);
            },
          });
      }
    }
  }
}
