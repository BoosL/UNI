import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { createRoutes } from '@uni/core';
import { environment } from 'src/environments/environment';

const routes: Routes = createRoutes(environment.routes);

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
