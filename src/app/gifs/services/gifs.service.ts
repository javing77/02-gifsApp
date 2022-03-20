import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGiftResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private servicioUrl = 'https://api.giphy.com/v1/gifs'
  private apiKey : string = '6USor7rWdcTujwxdCxMJhFdYnNrD3FuY';
  private _historial: string[] = [];

  // TODO: Cambiar any por su tipo
  public resultados: Gif[] = []


  get hsitorial() : string[] {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {

    if (localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }
      // Lo siguiente hace lo mismo que la validacion del if pero en una sola linea
      // this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

    if(localStorage.getItem('gifs')){
      this.resultados = JSON.parse(localStorage.getItem('gifs')!) || [];
    }

   }

  buscarGifs(query : string){

    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift( query );
      this._historial = this._historial.slice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }


    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);


    this.http.get<SearchGiftResponse>(`${this.servicioUrl}/search`, { params })
    .subscribe( (resp) => {
      this.resultados = resp.data;
      localStorage.setItem('gifs', JSON.stringify(this.resultados));
      console.log(resp.data);
    } );

    // console.log(this._historial);

  }

}
