import { Component } from '@angular/core';
import { LoginComponent } from './login/login'; // Importa el componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent], // Añádelo a los imports
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'hollow-delivery';
}
