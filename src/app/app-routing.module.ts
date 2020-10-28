import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredictorComponent, ViewerComponent } from './components';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'predict',
    pathMatch: 'full',
  },
  {
    path: 'predict',
    component: PredictorComponent,
  },
  {
    path: 'tune',
    component: ViewerComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
