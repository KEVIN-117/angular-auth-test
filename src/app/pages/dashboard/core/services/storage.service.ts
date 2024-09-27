import {Injectable} from '@angular/core';
import {SupabaseService} from "../../../../core/services/supabase.service";


type FileUpload = ArrayBuffer
  | ArrayBufferView
  | Blob
  | Buffer
  | File
  | FormData
  | NodeJS.ReadableStream
  | ReadableStream<Uint8Array>
  | URLSearchParams
  | string

interface FileSupabase{
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _supabaseClient;
  private images: any = []
  constructor( _supabaseClient: SupabaseService) {
    this._supabaseClient = _supabaseClient.supabaseClient
  }

  async upload(file: FileUpload ) {
    // @ts-ignore
    return this._supabaseClient.storage.from('gallery').upload(file?.name, file)
  }

  async getImages() {
    const {data} = await this._supabaseClient.storage.from('gallery').list()
    data?.forEach((image: FileSupabase) => {
      const { data } = this._supabaseClient.storage.from('gallery').getPublicUrl(image.name)
      this.images.push({name: image.name, url: data.publicUrl})
    })
    return this.images
  }
}
