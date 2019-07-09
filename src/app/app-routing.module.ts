import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 *  Set routes for Login and Order app page.
 *
 */

const routes: Routes = [
  {
    path: '',
    loadChildren: './auth/auth.module#AuthModule'
  },
  { path: 'app', loadChildren: './home/home.module#HomePageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
