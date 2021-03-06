import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading: boolean = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }


  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
