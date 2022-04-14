import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredictorComponent, ViewerComponent, BaseBuilderComponent } from './components';
import { ScannerComponent } from './components/scanner/scanner.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'scan',
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
  {
    path: 'scan',
    component: ScannerComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
