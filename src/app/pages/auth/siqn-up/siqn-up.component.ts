import {Component, inject} from '@angular/core';
import {ButtonsComponent} from "../components/buttons/buttons.component";
import {ContainerComponent} from "../components/container/container.component";
import {RouterLink} from "@angular/router";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormDto} from "../../../../types";
import {AuthService} from "../core/services/auth.service";
import {Subscription} from "rxjs";




@Component({
  selector: 'app-siqn-up',
  standalone: true,
  imports: [
    ButtonsComponent,
    ContainerComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './siqn-up.component.html',
  styleUrl: './siqn-up.component.css'
})
export default class SiqnUpComponent {
  protected form;
  isAuthenticated: boolean = false;
  private authSubscription!: Subscription;

  constructor(private readonly _authService: AuthService) {
    this.form = new FormGroup<FormDto>({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
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


  async submit(){
    if (!this.form.valid) return
    try {
      const {name, lastName, email, password} = this.form.value
      const {error, data} = await this._authService.signUp({
        email: email ?? '',
        password: password ?? '',
        name: name ?? '',
        lastName: lastName ?? ''
      })
      if (error) throw error
      alert(`You have successfully registered ${data.user?.email}`)
      this.form.reset()
    }catch (e){
      if (e instanceof Error) {
        console.error(e.message)
      }else {
        console.error(e)
      }
    }
  }
}

