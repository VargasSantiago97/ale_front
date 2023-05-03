import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-pdf',
  template: `
    <object [data]="pdfSrc" type="application/pdf" width="100%" height="800px"></object>
  `,
})
export class PdfComponent {
  pdfSrc: any = 'http://localhost/api/view.php';

  constructor(private http: HttpClient) {
    // Solicitar el archivo PDF al servidor
    this.http.get('http://localhost/api/view.php', { responseType: 'blob' })
      .subscribe((response: Blob) => {
        // Crear una URL del objeto Blob para el visor de PDF
        this.pdfSrc = URL.createObjectURL(response);
      });
  }
}