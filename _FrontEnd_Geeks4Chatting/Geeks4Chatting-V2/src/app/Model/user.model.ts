export interface User {
    userid: number;
    email: string;
    username: string;
    password: string;
    
}
export interface createUser {
    email: string;
    username: string;
    password: string;
    
}
export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    avatar: string; // Assuming the profile picture is a URL
    bio: string;
  }
export interface CreateContact{
    user1: number;
    user2: number;
  }
export interface Contact{
    contactid: number;
    user1:number;
    user2:number;
}