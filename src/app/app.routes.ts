import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { UnknownComponent } from './unknown/unknown.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { path: '', component: UnknownComponent },
  {
    path: 'users/:userId',
    component: UserComponent,
  },
  {
    path: 'customersGroups/page',
    redirectTo: 'customersGroups/page/1',
  },
  {
    path: 'customersGroups/page/:pg',
    component: CustomersComponent,
    runGuardsAndResolvers:"always",
  },
  {
    path: 'unknown1',
    component: UnknownComponent,
  },
  {
    path: 'unknown2',
    component: UnknownComponent,
  },
  {
    path: 'unknown3',
    component: UnknownComponent,
  },
  {
    path: 'unknown4',
    component: UnknownComponent,
  },
];
