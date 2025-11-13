import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Para la API Key

// Definir interfaces para la API de Gemini
interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  isModalVisible = false;
  isLoading = false;
  menuContent = '';

  private http = inject(HttpClient);

  openModal(): void {
    this.isModalVisible = true;
    this.callGeminiAPI();
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'Escape') {
      this.closeModal();
    }
  }

  callGeminiAPI(): void {
    this.isLoading = true;
    this.menuContent = '';

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${environment.geminiApiKey}`;

    const systemPrompt = "Actúa como el chef principal de un servicio de entrega de comida gótico y espeluznante con temática de insectos llamado 'Hollow Delivery', inspirado en el juego Hollow Knight.";
    const userQuery = "Genera un menú creativo y temático para hoy con 4 platos. Dale a cada plato un nombre y una breve descripción sabrosa y atmosférica. La comida debe sonar extraña pero deliciosa, usando ingredientes ficticios del mundo de Hollow Knight. Formatea cada plato con el nombre en negrita.";

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    this.http.post<GeminiResponse>(apiUrl, payload).subscribe({
      next: (result) => {
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-xl block mb-1 font-cinzel">$1</strong>');
        this.menuContent = html.split('\n').filter((line: string) => line.trim() !== '').map((line: string) => `<div class="menu-item mb-4">${line}</div>`).join('');
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error fetching Gemini API:", error);
        this.menuContent = '<p class="text-center text-red-400">No se pudo contactar con la cocina del Nido.</p>';
        this.isLoading = false;
      }
    });
  }
}
