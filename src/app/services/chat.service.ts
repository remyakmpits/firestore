import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, validateEventsArray } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';



export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}
 
@Injectable({
  providedIn: 'root'
})


export class ChatService {
  currentUser: User = null;
 
  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    //this.afAuth.onAuthStateChanged((user) => {
      //this.currentUser = user;      
    //});
    //this.currentUser= JSON.parse(localStorage.getItem('user'));
   
   // let value =this.getUsers().toPromise()
    //console.log("users List",this.getUserList());
    
    
    
    //this.getDoc()

    //console.log("users:::",this.getUsers())
  }
 
  async signup({ email, password }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
 console.log("credential::",credential)
    const uid = credential.user.uid;
    this.currentUser= credential.user;
   
    this.afs.doc(
      `users/${uid}`
    ).set({
      uid,
      email: credential.user.email,
    })
    this.afs.doc('chats/1').ref.get().then((documentSnapshot) => {
      console.log("exists::::",documentSnapshot.exists);
      if(!documentSnapshot.exists){
          //this.createChatDoc()
      }
    });
     return credential.user
     
  }
 
  signIn({ email, password }) {
   return this.afAuth.signInWithEmailAndPassword(email, password);
  }
 
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  createChatDoc (idValue:string){
    this.currentUser= JSON.parse(localStorage.getItem('user'));
    return this.afs.collection('chats').doc(idValue).set({
      messages:[],
      uid: this.currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  addChatMessage(msg) {
    this.currentUser= JSON.parse(localStorage.getItem('user'));
    const data = {
      from: this.currentUser.uid,
      content:msg,
      createdAt: Date.now(),
      fromMail:this.currentUser.email,
    };
    // return this.afs.collection('messages').add({
    //   msg: msg,
    //   from: this.currentUser.uid,
    //   createdAt: firebase.firestore.FieldValue.serverTimestamp()
    // });

    const ref = this.afs.collection('chats').doc(localStorage.getItem("chatId"));
    return ref.update({
      messages: firebase.firestore.FieldValue.arrayUnion(data)
    });
  }


   public getDoc() {
    // const snapshot = await this.afs.collection('chats').doc("1").get().toPromise();
    // console.log("snapshot",snapshot.data()['messages'])
    
    let value = this.afs.collection('chats').doc(localStorage.getItem("chatId")).valueChanges().pipe(
      map(messages => {
        console.log("msg::::",messages['messages']);
        const test = messages['messages']
        return test ;
      })
    ); 
    return value;
    // return value.pipe(messages => {
    //   return messages
    // }) as Observable<any[]>
   // console.log(value.pipe.arguments)
    
   }

   public getUserList (){

    let value = this.afs.collection('users').get();
    //   map(users => {
    //     console.log("usr::::",users);
    //     const test = users[0]
    //     return test ;
    //   })
    // ); 
    return value;

   }

   
   getChatMessages() {
  //   let users = [];
    
  //   return this.getUsers().pipe(
  //     switchMap(res => {
  //       users = res;
  //       return this.afs.collection('chats').doc("1").get().toPromise() ;
  //     }),
  //     map(messages => {
  //       // Get the real name for each user
  //       for (let m of messages) {          
  //         m.fromName = this.getUserForMsg(m.from, users);
  //         m.myMsg = this.currentUser.uid === m.from;
  //       }        
  //       return messages
  //     })
  //  )
  return  
   }
   
   private getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }
   
  private getUserForMsg(msgFromId, users: User[]): string {    
    for (let usr of users) {
      if (usr.uid == msgFromId) {
        return usr.email;
      }
    }
    return 'Deleted';
  }

public async getusersList(){
   return 
  

}
 
  // TODO Chat functionality
}