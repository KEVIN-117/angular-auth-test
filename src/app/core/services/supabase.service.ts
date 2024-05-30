import { Injectable } from '@angular/core';
import {createClient} from "@supabase/supabase-js";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: any;
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }
}
