import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare var vars: any;

@Injectable({
  providedIn: 'root'
})
export class PadronService {
  API_URI = vars.API_URI_PADRON;
  USER_ID: any = 0;

  constructor(private http: HttpClient) {}

  padronCUIT(data: any) {
    return this.http.get(`${this.API_URI}/padron.php?documento=${data}`);
  };

}
