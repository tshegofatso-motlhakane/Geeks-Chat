import { Observable } from "rxjs";

export interface Message {
   messageid: number,
   sender: number; 
   conversationId: string 
   content: string;
   timestamp: Date;
   status : MessageStatus

  }


export enum MessageStatus {
  Sent = 'SENT',
  Received = 'RECEIVED',
  Unread = 'UNREAD',
  Unreceived = 'UNRECEIVED',
  READ = "READ"
}

export interface MessageList{
  userid:number;
  username : String;
  lastestText : String;
  timestamp : Date;
  unread :  number;
}

export interface MessageList{
  userid:number;
  username : String;
  lastestText : String;
  timestamp : Date;
  unread :  number;
  avatar : string;
}

export interface ResponseObject<T> {
  message: string;
  status: string; // Assuming status is a string, adjust it accordingly
  data: T;
}

  