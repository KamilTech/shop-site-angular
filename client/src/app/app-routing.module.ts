import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShopComponent } from './components/shop/shop.component';
import { BlogComponent } from './components/blog/blog.component';
import { SingelPostComponent } from './components/singel-post/singel-post.component';
import { AboutComponent } from './components/about/about.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // The Default Route
  },
  {
    path: 'login',
    component: LoginComponent // Login
  },
  {
    path: 'shop',
    component: ShopComponent // Shop
  },
  {
    path: 'register',
    component: RegisterComponent // Register
  },
  {
    path: 'blog',
    component: BlogComponent, // Blog
    data: {
      animation: {
        value: 'products',
      }
    }
  },
  {
    path: 'post',
    component: SingelPostComponent,
    data: {
      animation: {
        value: 'product-detail',
      }
    }// Singel Post
  },
  {
    path: 'about-us',
    component: AboutComponent // About us
  },
  { path: '**', component: HomeComponent } // The "Catch-All" Route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }