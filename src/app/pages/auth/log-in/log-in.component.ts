import {Component, inject, OnDestroy} from '@angular/core';
import {ButtonsComponent} from "../components/buttons/buttons.component";
import {Router, RouterLink} from "@angular/router";
import {ContainerComponent} from "../components/container/container.component";
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ReactiveFormsModule } from "@angular/forms"
import {AuthService} from "../core/services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ButtonsComponent,
    RouterLink,
    ContainerComponent,
    ReactiveFormsModule
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export default class LogInComponent{
  protected formControl;
  isAuthenticated: boolean = false;
  private authSubscription!: Subscription;
  constructor(private _authService: AuthService, private _router: Router) {
    this.formControl = new FormGroup({
      email: new FormControl('dihos56655@adrais.com', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('n%6R7m4Mp6pTsM', [
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }

  ngOnInit() {
    this.authSubscription = this._authService.getAuthStateChanges().subscribe(session => {
      this.isAuthenticated = session !== null;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }


  async onSubmit() {
    if (!this.formControl.valid) return
    try {
      const { email, password } = this.formControl.value
      const { error, data } = await this._authService.logIn({
        email: email ?? '',
        password: password ?? ''
      })
      if (error) {
        throw error
      }
      this.formControl.reset()
      alert(`You have successfully logged in ${data.user?.email}`)
      await this._router.navigateByUrl('/dashboard')
    }catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
      }
    }
  }

}
