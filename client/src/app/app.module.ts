import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShopComponent } from './components/shop/shop.component';
import { BlogComponent } from './components/blog/blog.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SingelPostComponent } from './components/singel-post/singel-post.component';
import { AboutComponent } from './components/about/about.component';
import { ViewCardComponent } from './components/view-card/view-card.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { AdminPostComponent } from './components/admin-post/admin-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { ShopService } from './services/shop.service';
import { AuthInterceptor } from './services/auth.interceptor';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { AdminGuard } from './guards/admin.guard';

import { SortenPipe } from './pipes/shortenDescribe';
import { AddItemComponent } from './components/add-item/add-item.component';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgxPaginationModule } from 'ngx-pagination'; 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ShopComponent,
    SideBarComponent,
    SingelPostComponent,
    AboutComponent,
    ProfileComponent,
    ViewCardComponent,
    AddPostComponent,
    AdminPostComponent,
    EditPostComponent,
    SortenPipe,
    BlogComponent,
    AddItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SnotifyModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:4200']
      }
    }),
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [
      { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
      SnotifyService,
      AuthService,
      BlogService,
      ShopService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      AuthGuard,
      NotAuthGuard,
      AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
