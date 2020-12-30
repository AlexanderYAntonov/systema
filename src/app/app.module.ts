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

@NgModule({
  declarations: [ AppComponent, ViewerComponent, PredictorComponent, HeaderComponent, BaseBuilderComponent, BaseSelectorComponent, KoefSelectorComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
