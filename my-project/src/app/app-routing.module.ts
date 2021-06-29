import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { CrudComponent } from "./components/crud/crud.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { UsuarioComponent } from './components/usuario/usuario.component';
import { AuthGuard } from "./guards/auth.guard";
import { ModalComponent } from './modal/modal.component';


const routes: Routes = [ //Aqui agregamos las diferenctes rutas para nuestras paginas :3
  {
    path:'home',
    component:HomeComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path: 'crud',
    component: CrudComponent
  },
  {
    path:'modal',
    component:ModalComponent
  },
  {
    path:'home/usuario',
    component:UsuarioComponent,
    canActivate:[AuthGuard]
  }, 
  {
    path:'home/chat',
    component:ChatComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
