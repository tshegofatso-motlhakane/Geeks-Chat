import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Contact, CreateContact, User } from '../Model/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl = 'http://localhost:8080/api/contact'
  private contactsSubject = new BehaviorSubject<User[]>([]);
  contacts$ = this.contactsSubject.asObservable();

   contacts : User[] = [];
  
  constructor(private http : HttpClient) { 
   
  }

  fetchContacts(userId: number): Observable<User[]> {
    const url = `${this.baseUrl}/get/${userId}/all`;
    return this.http.get<User[]>(url).pipe(
      tap((initialContacts: User[]) => {
        // Update the contacts subject after successful fetch
        this.contactsSubject.next(initialContacts);
      }),
      catchError((error: any) => {
        console.error('Error fetching contacts:', error);
        return throwError(error); // Rethrow the error for handling in the caller
      })
    );
  }

  fetchContacts2(userId: number): Observable<User[]> {
    const url = `${this.baseUrl}/get/${userId}/all`;
    return this.http.get<User[]>(url).pipe(
      tap((fetchedContacts: User[]) => {
        console.log("Fetched Contacts:"+this.contacts);
        this.contacts = [...fetchedContacts]; // Use spread operator to create a new list
      }),
      catchError((error: any) => {
        console.error('Error fetching contacts:', error);
        throw error;
      })
    );
  }

  addNewContactToList(newContact: CreateContact): void {
    const addContactUrl = `${this.baseUrl}/add`;
  
    this.http.post<User[]>(addContactUrl, newContact).subscribe(
      (updatedContacts: User[]) => {
        this.contacts = updatedContacts;
  
        const newContact: User = this.contacts[this.contacts.length - 1];
        console.log("New list:", this.contacts);
      },
      (error) => {
        console.error('Error adding contact:', error);
      }
    );
  }
  

 
  getCurrentUser(): number {
    const currentUserString = sessionStorage.getItem('currentUser');

    if (currentUserString) {
      const currentUser: User = JSON.parse(currentUserString);
      return currentUser.userid;
    }

    return 0; // or any other default value if user is not found
  }

  getConversatioIds() {

   const theList = this.fetchContacts(this.getCurrentUser());
  }

  getContacts(searchTerm: string): Observable<User[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    const userId = this.getCurrentUser();
    const url = `${this.baseUrl}/${userId}/search`;
    return this.http.get<User[]>(url, { params });
  }


  clearContactList() {
    this.contactsSubject.next([]);
  }

  getconversationid( receiver: number): string{
     const sender = this.getCurrentUser();
    
    if(sender < receiver)
    {
      return sender+"_"+receiver;
    }else
    if(sender > receiver)
    {
      return receiver+"_"+sender;
    }else
    {
      return "ubnormal chatid";
    }

  }
 
}
