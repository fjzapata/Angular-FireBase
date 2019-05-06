import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPrincipalComponent } from './view-principal/view-principal.component';

const routes: Routes = [
  { path: '404', component: ViewPrincipalComponent },
  { path: '', component: ViewPrincipalComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
