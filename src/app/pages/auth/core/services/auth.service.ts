import {Injectable} from '@angular/core';
import {Session, SignUpWithPasswordCredentials} from "@supabase/supabase-js";
import {UserDto} from "../../../../../types";
import {SupabaseService} from "../../../../core/services/supabase.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _supabaseClient;

  private authStateChange:BehaviorSubject<Session | null> = new BehaviorSubject<Session | null>(null)

  constructor(_supabaseClient: SupabaseService) {
    this._supabaseClient = _supabaseClient.supabaseClient;
    this._supabaseClient.auth.onAuthStateChange((event, session)=>{
      this.authStateChange.next(session)
    })
  }

  getAuthStateChanges(): Observable<Session | null> {
    return this.authStateChange.asObservable();
  }

  session() {
    return this._supabaseClient.auth.getSession()
  }

  signUp(credentials: UserDto){
    const { email, password } = credentials
    const asCredentials = { email, password} as SignUpWithPasswordCredentials
    return this._supabaseClient.auth.signUp(asCredentials)
  }

  logIn(credentials: SignUpWithPasswordCredentials){
    return this._supabaseClient.auth.signInWithPassword(credentials)
  }

  sigOut(){
    return this._supabaseClient.auth.signOut()
  }
}
