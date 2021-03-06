import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShopComponent } from './components/shop/shop.component';
import { BlogComponent } from './components/blog/blog.component';
import { SingelPostComponent } from './components/singel-post/singel-post.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ViewCardComponent } from './components/view-card/view-card.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { AdminPostComponent } from './components/admin-post/admin-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { AdminGuard } from './guards/admin.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // The Default Route
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard] // Login
  },
  {
    path: 'shop',
    component: ShopComponent // Shop
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard] // Register
  },
  {
    path: 'blog',
    component: BlogComponent // Blog
  },
  {
    path: 'post/:id',
    component: SingelPostComponent // Singel Post
  },
  {
    path: 'about-us',
    component: AboutComponent // About us
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard] // Profile
  },
  {
    path: 'view-cart',
    component: ViewCardComponent
  },
  {
    path: 'add-post',
    component: AddPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-post',
    component: AdminPostComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'edit-post/:id',
    component: EditPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-item',
    component: AddItemComponent,
    canActivate: [AuthGuard]
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
