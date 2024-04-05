import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { PlaylistModule } from 'src/app/playlist/playlist.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    PlaylistModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
