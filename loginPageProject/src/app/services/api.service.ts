import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../post';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiURL = "https://atologistinfotech.com/api/register.php?";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http : HttpClient) { }

  postRequest(data:any):Observable<Post>{
    return this.http.post<Post>(this.apiURL, JSON.stringify(data), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
      console.log(errorMessage)
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.log(errorMessage)
    }
    return throwError(errorMessage);
  }
}
