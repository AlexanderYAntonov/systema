import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerComponent } from './components/viewer/viewer.component';
import { PredictorComponent } from './components/predictor/predictor.component';
import { HeaderComponent } from './components/header/header.component';
import { BaseBuilderComponent } from './components/base-builder/base-builder.component';
import { BaseSelectorComponent } from './components/base-selector/base-selector.component';
import { KoefSelectorComponent } from './components/koef-selector/koef-selector.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { MatrixComponent } from './components/matrix/matrix.component';
import { PredictTableComponent } from './components/predict-table/predict-table.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { FormViewerComponent } from './components/form-viewer/form-viewer.component';
import { FormCounterPipe } from './components/form-viewer/form-counter.pipe';
import { HasReliablePredictionPipe } from './pipes/has-reliable-prediction.pipe';

@NgModule({
  declarations: [ AppComponent, ViewerComponent, PredictorComponent, HeaderComponent, BaseBuilderComponent, BaseSelectorComponent, KoefSelectorComponent, MatrixComponent, PredictTableComponent, ScannerComponent, FormViewerComponent, FormCounterPipe, HasReliablePredictionPipe ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatProgressBarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
