import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
 
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
 
  messages:Observable<any[]>;
  newMsg = '';
  uid: any;
  currentUser: any;
 
  constructor(private chatService: ChatService, private router: Router,private route: ActivatedRoute) { }

  async ngOnInit() {
    this.currentUser= JSON.parse(localStorage.getItem('user'));
   // this.messages = this.chatService.getChatMessages();
  //this.chatService.get()
  this.messages = this.chatService.getDoc() 
  //console.log("messages chat",this.messages)
  
  
  }
 
  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }
 
  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }
 
}