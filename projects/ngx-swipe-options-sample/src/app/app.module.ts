import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxSwipeOptionsModule} from "../../../ngx-swipe-options/src/lib/ngx-swipe-options.module";

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxSwipeOptionsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
