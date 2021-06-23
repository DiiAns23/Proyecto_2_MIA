import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  name: string = "";
  username: string = "";
  password: string = "";
  confirm_password: string = "";

  addUser(){
    if((this.password == this.confirm_password) && (this.password!="") && (this.confirm_password!=""))
    {
      console.log("Yes, register")
      console.log("Hello! ",this.username, this.name);
    }
    else{
      console.log("Please enter all fields");
    }
    
    this.name = "";
    this.username = "";
    this.password = "";
    this.confirm_password = "";
  }

}
