import { Component, OnInit } from '@angular/core';
import {AbstractControl,FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../../services/api.service";
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formResponse:any = {};
  showPassword:boolean = false;
  isSubmitted:boolean = false;
  isFocusOn:string = '';
  constructor(
    private formBuilder:FormBuilder,
    private api:ApiService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  registerForm:FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    encryptpassword: new FormControl(''),
    dob: new FormControl(''),
    mobile: new FormControl('')
  })

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',[Validators.required, Validators.email]],
      encryptpassword:['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      dob:['',Validators.required],
      mobile:['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    })
  }

  encryptPassword() :void{
    this.registerForm.value.encryptpassword = CryptoJS.AES.encrypt( this.registerForm.value.encryptpassword, "encryptpassword").toString()
  }
  onFocus(field:string): void{
    this.isFocusOn=field;
  }

  onBlur(): void{
    this.isFocusOn='';
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.valid) {
      this.encryptPassword();

      const formData = new FormData()
      formData.append('firstname', this.registerForm.value['firstname']);
      formData.append('lastname', this.registerForm.value['lastname']);
      formData.append('email', this.registerForm.value['email']);
      formData.append('encryptpassword', this.registerForm.value['encryptpassword']);
      formData.append('dob', this.registerForm.value['dob']);
      formData.append('mobile', this.registerForm.value['mobile']);

      this.api.postRequest(formData)
        .subscribe({
          next:(response) => {
            this.formResponse = response;
            if(this.formResponse.success > 0){
              alert(this.formResponse.data)
              this.onReset();
            }else{
              console.log(this.formResponse.error_code)
            }
          },error:() => {console.log('error')}
        })
    }
  }

  onReset(): void {
    this.isSubmitted = false;
    this.registerForm.reset();
  }

}
