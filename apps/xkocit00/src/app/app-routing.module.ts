import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/main/app.component';
import { LoginComponent } from './components/login/login.component';
import { ListOfListsComponent } from './components/list-of-lists/list-of-lists.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {
    path: 'main-list',
    component: ListOfListsComponent,
  },
  { path: 'list/:listID', component: ListComponent },
  { path: 'login', component: LoginComponent },
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
