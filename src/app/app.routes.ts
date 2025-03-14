import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { ClientFormComponent } from './components/forms/client-form/client-form.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { OwnerComponent } from './components/owner/owner.component';
import { OwnerFormComponent } from './components/forms/owner-form/owner-form.component';
import { ProviderFormComponent } from './components/forms/provider-form/provider-form.component';
import { AuthComponent } from './components/forms/auth/auth.component';
import { DashboardComponent } from './components/owner/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path: 'login',component:AuthComponent},
    {path:'contact',component:ContactComponent},
    {path:'register',component:ClientFormComponent},
    {path:'about-us',component:AboutUsComponent},
    {path: 'owner',component:OwnerComponent},
    {path:'register-admin',component:OwnerFormComponent},
    {path: 'provider', component:ProviderFormComponent},
    {path: "dashboard", component:DashboardComponent, canActivate:[authGuard],data:{role:['ROLE_ADMIN']}}
];
