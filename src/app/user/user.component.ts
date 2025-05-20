import { Component, inject, input, OnInit } from '@angular/core';
import { ProxyService } from '../proxy.service';
import { User } from '../customers/user.model';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  userId = input.required<string>();
  http = inject(ProxyService);
  currentUser: User | undefined;
  router: Router = inject(Router);
  usersService = inject(UsersService);
  ngOnInit() {
    const subscription = this.http.getOneUsr(this.userId()).subscribe({
      next: (resData) => {
        this.currentUser = resData as User;
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }
  onBackToUserClick() {
    if (this.usersService.lastUserSearch()) {
      this.router.navigate(
        ['/customersGroups', 'page', this.usersService.lastPage()],
        { queryParams: { search: this.usersService.lastUserSearch() } }
      );
    } else {
      this.router.navigate([
        '/customersGroups',
        'page',
        this.usersService.lastPage(),
      ]);
    }
  }
}
