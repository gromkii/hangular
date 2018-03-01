import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SceneComponent } from './scene/scene.component';
import {DataService} from "./services/data.service";
import {HttpModule} from "@angular/http";
import { MathHelperService } from './services/math-helper.service';

@NgModule({
  declarations: [
    AppComponent,
    SceneComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [DataService, MathHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
