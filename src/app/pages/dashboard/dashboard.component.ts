import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {StorageService} from "./core/services/storage.service";
import {AuthService} from "../auth/core/services/auth.service";
import {Subscription} from "rxjs";

interface FileUpload {
  file: any;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent {
  previewUrl: string | ArrayBuffer | null = null;

  isAuthenticated: boolean = false;
  private authSubscription!: Subscription;

  protected images: any = []
  protected formControl ;
  constructor(private _storageService: StorageService, private _authService: AuthService) {
    this.formControl = new FormGroup<FileUpload>({
      file: new FormControl(null, [
        Validators.required
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

  async getData() {
    const data = await this._authService.session()
    await this.getImages()
  }

  async getImages(){
    this.images = await this._storageService.getImages()
  }



  onFileChange(event: Event): void {
    const file = event.target as HTMLInputElement
    if (!file) return
    const dataFile = file.files?.item(0)
    if (!dataFile) return
    this.previewUrl = URL.createObjectURL(dataFile)
  }

  async onSubmit(event: Event) {
    event.preventDefault()
    const file = event.target as HTMLInputElement
    if (!file) return
    // @ts-ignore
    const dataFile = file.profile.files?.item(0)
    try {
      const {error, data} = await this._storageService.upload(dataFile)
      if (error) throw new Error(error.message)
      if (data) {
        alert('File uploaded successfully')
        this.previewUrl = null
        this.formControl.reset()
      }
    }catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
      }
    }
  }
}
