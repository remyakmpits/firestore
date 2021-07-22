import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationExtras, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users:Array<any> = []
  currentUser= JSON.parse(localStorage.getItem('user'));
  

  constructor(private chatService: ChatService,public afAuth: AngularFireAuth, public afs: AngularFirestore
    , private router: Router,) { }

  async ngOnInit() {
   firebase.firestore().collection('users').get()
  .then(querySnapshot => {
    querySnapshot.docs.map(doc => {
      console.log('LOG 1', doc.data());
      this.users.push(doc.data())
      return doc.data();
    });
  });
  console.log("values:::::",this.users)
  }

  selectChatWithId(id:string){
   // this.router.navigateByUrl('/chat', { replaceUrl: true });

  
    
    //let result = (id < this.currentUser.uid)
    //alert(result)
    let idValue:string
    if(id>this.currentUser.uid){
     idValue = this.currentUser.uid+id
    }else{
      idValue = id+this.currentUser.uid
    }
    console.log("id,"+idValue)
    this.chatService.afs.doc('chats/'+idValue).ref.get().then((documentSnapshot) => {
      console.log("exists::::",documentSnapshot.exists);
      if(!documentSnapshot.exists){
          this.chatService.createChatDoc(idValue)
      }
    });

    localStorage.setItem('chatId', idValue);
    this.router.navigateByUrl('/chat', { replaceUrl: true });
  }

}
