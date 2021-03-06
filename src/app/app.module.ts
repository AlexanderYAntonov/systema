import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
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

import { MatrixComponent } from './components/matrix/matrix.component';

@NgModule({
  declarations: [ AppComponent, ViewerComponent, PredictorComponent, HeaderComponent, BaseBuilderComponent, BaseSelectorComponent, KoefSelectorComponent, MatrixComponent ],
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
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
