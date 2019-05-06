import { Injectable } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  // OBTENER TODOS LOS ITEM REGISTRADOS.
  public get_AllItem(item:any) {
    // OBTENER.
    return this.firestore.collection(item).snapshotChanges();
  }

  //OBTIENE UN REGISTRO CON EL ID
  public get_ItemId(item:any,Id:string) {
    return this.firestore.collection(item).doc(Id).snapshotChanges();
  }

  // INSERTAR NUEVO ITEM.
  public Insert_Item(item:any,data:any) {
    return this.firestore.collection(item).add(data);
  }
  
  //ACTUALIZAR ITEM.
  public Update_Item(item:any,Id:string,data:any) {
    return this.firestore.collection(item).doc(Id).set(data);
  }

  // ELIMINAR ITEM.
  public Delete_Item(item:any,Id:string) {
    return this.firestore 
      .collection (item) 
        .doc (Id) 
          .delete(); 
  }
}
