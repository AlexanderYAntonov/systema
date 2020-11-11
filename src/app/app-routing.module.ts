import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredictorComponent, ViewerComponent, BaseBuilderComponent } from './components';

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
  {
    path: 'convert',
    component: BaseBuilderComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
