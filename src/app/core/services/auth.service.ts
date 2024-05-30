import {inject, Injectable} from '@angular/core';
import {SupabaseService} from "./supabase.service";
import {SignUpWithPasswordCredentials} from "@supabase/supabase-js";
import {UserDto} from "../../../types";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _supabaseClient = inject(SupabaseService).supabase

  session() {
    return this._supabaseClient.auth.getSession()
  }

  signUp(credentials: UserDto){
    const { email, password } = credentials
    const asCredentials = { email, password} as SignUpWithPasswordCredentials
    return this._supabaseClient.auth.signUp(asCredentials)
  }

  logIn(credentials: SignUpWithPasswordCredentials){
    return this._supabaseClient.auth.signIn(credentials)
  }

  sigOut(){
    return this._supabaseClient.auth.signOut()
  }
}
