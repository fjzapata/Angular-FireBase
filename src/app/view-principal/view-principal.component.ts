import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
// SERVICIO PARA LOS CRUD.
import { CrudService } from '../service/crud.service';
// ALERT.
import swal from 'sweetalert2';
// DATATABLE.
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';

export interface Cliente {
  cli_nombre: string;
  cli_apellido: string;
  cli_tipodocumento: number;
  cli_documento: number;
  cli_fechanacimiento: Date;
  cli_observacion?: string
}

// jQuery Sign $
declare let $: any;

@Component({
  selector: 'app-view-principal',
  templateUrl: './view-principal.component.html',
  styleUrls: ['./view-principal.component.css']
})
export class ViewPrincipalComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  // 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // MODALS.
  @ViewChild('modalitem') mdInsert_Edit: ElementRef; // Modal CRUD.
  // 
  public dataCli: any;
  public ArrayCliente = [];
  public InsertId:any = 0; 
  public IntTable:Boolean = false;

  constructor(
    private crud: CrudService
  ) { }

  ngOnInit() {
    // 
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      rowCallback: (row: Node, data: any, index: number) => {
        //
        $('td:eq(5)', row).addClass('text-center');
        // 
        $('td:eq(5) #edit', row).unbind('click');
        $('td:eq(5) #edit', row).bind('click', () => {
          // OBTEBER DATOS DEL CLIENTE.
          this.crud.get_ItemId('cliente',data[0]).subscribe((response) => {
            // ASIGNAR DATOS.
            this.dataCli = response.payload.data();
            // ASIGNAR ID DEL CLIENTE.
            this.InsertId = data[0];
            // ABRIR MODAL.
            $(this.mdInsert_Edit.nativeElement).modal('show');
          });
        });
        // ELIMINAR CLIENTE.
        $('td:eq(5) #delete', row).unbind('click');
        $('td:eq(5) #delete', row).bind('click', () => {
          swal({
            title: "¿Esta Seguro que desea eliminar este cliente?",
            text: "Una vez eliminado no se podrá recuperar.",
            type: "question",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Eliminar",
            allowEscapeKey: false,
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) { 
              // OBTEBER DATOS DEL CLIENTE.
              this.crud.Delete_Item('cliente',data[0]);
            }
          }).catch(swal.noop)
        });
        return row;
      },
      "order": [[0, "desc"]]
    };
    // EJECUTAR FUNCION.
    this.get_clientes();
    // MODAL - EJECUTAR ACCION AL CERRAR.
    $(this.mdInsert_Edit.nativeElement).on('hidden.bs.modal', () => {
      // REASIGNAR VARIABLE DATOS DEL CLIENTE.
      this.dataCli = [];
    })
  }

  // Iniciar la tabla de la lista de servicios
  private Init(): void {
    // VALIDAR SI LA TABLA NO HA SIDO INICIALIZADA.
    if(!this.IntTable) {
      this.dtTrigger.next();
    }else{
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
  }

  // ABRIR MODAL.
  public showModal_addItem(): void {
    // ACCION.
    this.InsertId = 0;
    // ABRIR MODAL.
    $(this.mdInsert_Edit.nativeElement).modal('show');
  }

  // GUARDAR NUEVO CLIENTE.
  public Guardar_Item(FormData: NgForm) :void {
    // NOTIFICACION DE ESPERA PARA EL USUARIO.
    swal({ // Espera mientras el servidor ejecuta la peticion.
      text: 'Procesando, por favor espere...',
      onOpen: function () {
        swal.showLoading()
      },
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    }).catch(swal.noop);
    // VALIDAR SI ES INSERCION O ACTUALIZACION.
    if(this.InsertId == 0) {
      // INSERTAR NUEVO REGISTRO.
      this.crud.Insert_Item('cliente',FormData.value).then(resp => {
        // 
        swal({
          title: "Exito",
          text: "Los datos fueron guardados correctamente",
          type: "success",
          showCancelButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false
        }).then((result) => {
          if (result.value) { 
            // CERRAR MODAL.
            $(this.mdInsert_Edit.nativeElement).modal('hide');
          }
        }).catch(swal.noop)
        // 
      }, (error) => {
        console.log(error);
      });
    } else {
      // ACTUALIZAR REGISTRO.
      this.crud.Update_Item('cliente',this.InsertId,FormData.value).then(() => {
        // 
        swal({
          title: "Exito",
          text: "Los datos fueron guardados correctamente",
          type: "success",
          showCancelButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false
        }).then((result) => {
          if (result.value) { 
            // CERRAR MODAL.
            $(this.mdInsert_Edit.nativeElement).modal('hide');
          }
        }).catch(swal.noop)
        // 
      }, (error) => {
        console.log(error);
      });
    }
  }

  // OBTENER TODOS LOS CLIENTES REGISTRADOS.
  public get_clientes() {
    // 
    this.crud.get_AllItem('cliente').subscribe((response) => {
      this.ArrayCliente = [];
      response.forEach((catData: any) => {
        this.ArrayCliente.push({
          id: catData.payload.doc.id,
          data: catData.payload.doc.data()
        });
      })
      // INICIALIZAR DATATABLE.
      this.Init();
      this.IntTable = true;
    });
  }
}