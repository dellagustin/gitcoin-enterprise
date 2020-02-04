import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public static backendBaseURL = 'http://localhost:3000';
  public constructor(private readonly http: HttpClient) { }

  public get(url: any): any {
    console.log(`calling to get ${url}`);
    return this.http.get<any>(url);
  }

  public post(url: string, body: any) {
    // const urlWithClient = `${url}?client=${document.URL}`;
    const urlWithClient = url;
    console.log(`calling to post to ${urlWithClient}`);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log(JSON.stringify(body));
    return this.http.post<any>(urlWithClient, JSON.stringify(body), httpOptions);
  }

}
