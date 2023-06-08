import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { DatePipe } from '@angular/common';

declare var vars: any;

@Component({
  selector: 'app-kilos-campo',
  templateUrl: './kilos-campo.component.html',
  styleUrls: ['./kilos-campo.component.css']
})
export class KilosCampoComponent {

  API_URI_UPLOAD = vars.API_URI_UPLOAD;

  cols: any = [];
  selectedColumns: any = [];
  tamanoCols: any = {};

  dataParaMostrarTabla: any = []

  displayFiltros: Boolean = false;
  displayNuevoMovimiento: Boolean = false;
  displayObservacion: Boolean = false;
  displayBanderas: Boolean = false;
  displayBanderasDis: Boolean = false;
  displayOrdenCarga: Boolean = false;
  displayVistas: Boolean = false;
  displayCPE: Boolean = false;
  displayVerCPE: Boolean = false;
  displayEditarCPE: Boolean = false;

  spinnerActualizarCPE: Boolean = false;

  accordeonVer = [false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false]
  optionsDe: any = [{ label: 'Silo', id: 'S' }, { label: 'Trilla', id: 'T' }, { label: 'Otro', id: 'O' }]

  //DATA-VARIABLES DE DB:
  db_camiones: any = []
  db_choferes: any = []
  db_condicion_iva: any = []
  db_socios: any = []
  db_transportistas: any = []
  db_transportistas_all: any = []
  db_campanas: any = []
  db_depositos: any = []
  db_establecimientos: any = []
  db_gastos: any = []
  db_granos: any = []
  db_banderas: any = []
  db_corredores: any = []
  db_acopios: any = []
  db_ordenes_carga: any = []
  db_movimientos: any = []
  db_intervinientes: any = []
  db_carta_porte: any = []
  db_asientos: any = []
  db_ordenes_pago: any = []

  load_camiones: any = true
  load_choferes: any = true
  load_socios: any = true
  load_transportistas_all: any = true
  load_depositos: any = true
  load_establecimientos: any = true
  load_granos: any = true
  load_ordenes_carga: any = true
  load_intervinientes: any = true
  load_movimientos: any = true
  load_carta_porte: any = true
  load_ordenes_pago: any = true


  datosRegistro: any;
  datosObservacion: any = '';

  transportista: any;
  chofer: any;
  camion: any;

  select_choferes: any = [];
  select_camiones: any = [];

  cod_transporte: any;
  cod_chofer: any;
  cod_camion: any;

  establecimiento: any;

  disFlag: any = { icono: null, fondo: null, color: null };
  fondosFlag: any = ['info', 'success', 'warning', 'danger'];
  iconsFlag: any = ['pi-flag-fill', 'pi-bookmark-fill', 'pi-calendar', 'pi-check-square', 'pi-circle-fill', 'pi-cog', 'pi-dollar', 'pi-file-edit', 'pi-info-circle', 'pi-sync', 'pi-thumbs-up-fill', 'pi-thumbs-down-fill', 'pi-user', 'pi-exclamation-triangle', 'pi-exclamation-circle'];

  datosMovimiento: any;
  datosOrdenCarga: any = {};
  datosCPE: any = {};

  datosVerCPE: any = [];
  datosEditarCPE: any = {};
  cambiosDetectadosCPE: any = [];
  datosParaActualizarCPE: any = {};

  existePlantilla = false;

  intervinientesCPE: any = {};

  cpeCamposOrigen: any = [];
  cpePlantasDestino: any = [];
  cpeCamposDestino: any = [];

  datosFiltro: any = {
      fechaDesde: new Date('01/01/2023'),
      fechaHasta: new Date('12/31/2023'),
      granos: ['vacios', 'todos'],
      socios: ['vacios', 'todos'],
      establecimientos: ['vacios', 'todos'],
      transportistas: ['vacios', 'todos'],
      corredores: ['vacios', 'todos'],
      acopios: ['vacios', 'todos'],
      id_bandera: []
  };
  datos_filtrar_granos: any = []
  datos_filtrar_socios: any = []
  datos_filtrar_establecimientos: any = []
  datos_filtrar_transportistas: any = []
  datos_filtrar_corredores: any = []
  datos_filtrar_acopios: any = []

  filtroRapido: any = {}

  selectedTablaInicio: any

  faltan_kg_bruto = true
  faltan_kg_tara = true
  faltan_kg_neto = true
  faltan_kg_neto_final = true
  faltan_kg_campo = false

  constructor(
      private comunicacionService: ComunicacionService,
      private messageService: MessageService,
  ) { }

  ngOnInit() {
      this.cols = [
          { field: "cultivo", header: "Cultivo" },
          { field: "fecha", header: "Fecha" },
          { field: "orden", header: "O.C." },
          { field: "benef_orden", header: "Benef Orden" },
          { field: "cpe", header: "N° C.P." },
          { field: "benef", header: "Benef C.P." },
          { field: "ctg", header: "C.T.G." },
          { field: "id_origen", header: "Campo" },
          { field: "tipo_orig", header: "Desde" },
          { field: "pat", header: "Pat." },
          { field: "patAc", header: "Pat. Ac." },
          { field: "transporte", header: "Transporte" },
          { field: "chofer", header: "Chofer" },
          { field: "id_corredor", header: "Corredor" },
          { field: "id_acopio", header: "Acopio" },

          { field: "kg_tara", header: "Tara" },
          { field: "kg_bruto", header: "Bruto" },
          { field: "kg_neto", header: "Neto" },
          { field: "kg_regulacion", header: "Carga/Desc" },
          { field: "id_deposito", header: "Dep." },
          { field: "kg_neto_final", header: "Neto Final" },
          { field: "kg_campo", header: "Neto Campo" },

          
          { field: "observaciones", header: "Obs" },
      ];
      this.selectedColumns = [
          { field: "cultivo", header: "Cultivo" },
          { field: "fecha", header: "Fecha" },
          { field: "orden", header: "O.C." },
          { field: "benef_orden", header: "Benef Orden" },
          { field: "cpe", header: "N° C.P." },
          { field: "benef", header: "Benef C.P." },
          { field: "ctg", header: "C.T.G." },
          { field: "id_origen", header: "Campo" },
          { field: "tipo_orig", header: "Desde" },
          { field: "pat", header: "Pat." },
          { field: "patAc", header: "Pat. Ac." },
          { field: "transporte", header: "Transporte" },
          { field: "chofer", header: "Chofer" },
          { field: "id_corredor", header: "Corredor" },
          { field: "id_acopio", header: "Acopio" },

          { field: "kg_tara", header: "Tara" },
          { field: "kg_bruto", header: "Bruto" },
          { field: "kg_neto", header: "Neto" },
          { field: "kg_regulacion", header: "Carga/Desc" },
          { field: "id_deposito", header: "Dep." },
          { field: "kg_neto_final", header: "Neto Final" },
          { field: "kg_campo", header: "Neto Campo" },

          
          { field: "observaciones", header: "Obs" },
      ];
      this.tamanoCols = {
          cultivo: '50px',
          fecha: '90px',
          orden: '90px',
          benef_orden: '80px',
          cpe: '100px',
          benef: '80px',
          ctg: '110px',
          campo: '100px',
          tipo_orig: '100px',
          pat: '100px',
          patAc: '100px',
          transporte: '230px',
          chofer: '230px',
          cuit_transp: '100px',
          id_corredor: '150px',
          id_acopio: '150px',
          kg_tara: '100px',
          kg_bruto: '100px',
          kg_neto: '100px',
          kg_regulacion: '100px',
          kg_neto_final: '100px',
          kg_campo: '100px',
          factura: '100px',
          gastos: '100px',
          pagado: '100px',
          observaciones: '200px',
          banderas: '80px'
      }





      var fecha = new Date()
      fecha.setHours(fecha.getHours() - 3);
      const datePipe = new DatePipe('en-US');
      const fechaHoy = datePipe.transform(fecha, 'yyyy-MM-dd');
      this.datosMovimiento = {
          id: null,
          fecha: null,
          id_campana: null,
          id_socio: null,
          id_origen: null,
          id_grano: null,
          id_transporte: null,
          id_chofer: null,
          id_camion: null,
          id_corredor: null,
          id_acopio: null,
          id_deposito: null,
          id_bandera: [],
          kg_bruto: null,
          kg_tara: null,
          kg_neto: null,
          kg_regulacion: null,
          kg_neto_final: null,
          kg_campo: null,
          observaciones: null,
          tipo_origen: null,
          creado_por: null,
          creado_el: null,
          editado_por: null,
          editado_el: null,
          activo: 1,
          estado: 1
      }

      this.datosMovimiento.fecha = fechaHoy
      if (typeof this.datosMovimiento.id_bandera == 'string'){
          this.datosMovimiento.id_bandera = JSON.parse(this.datosMovimiento.id_bandera)
      }






      this.obtenerCamiones()
      this.obtenerChoferes()
      this.obtenerSocios()
      this.obtenerDepositos()
      this.obtenerEstablecimientos()
      this.obtenerGranos()
      this.obtenerOrdenesCarga()
      this.obtenerIntervinientes()
      this.obtenerMovimientos()
      this.obtenerCartasPorte()
      this.obtenerOrdenesPago()
      this.obtenerTransportistasAll()
  }

  obtenerCamiones() {
      this.comunicacionService.getDB('camiones').subscribe(
          (res: any) => {
              this.db_camiones = res;
              this.load_camiones = false;
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerChoferes() {
      this.comunicacionService.getDB('choferes').subscribe(
          (res: any) => {
              this.db_choferes = res;
              this.load_choferes = false;
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerSocios() {
      this.comunicacionService.getDB('socios').subscribe(
          (res: any) => {
              this.db_socios = res;
              this.load_socios = false;

              this.datos_filtrar_socios = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_socios]

              res.forEach((e: any) => {
                  this.datosFiltro.socios.push(e.id)
              })

              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerTransportistasAll() {
      this.comunicacionService.getDBAll('transportistas').subscribe(
          (res: any) => {
              this.db_transportistas_all = res;
              this.load_transportistas_all = false;

              this.datos_filtrar_transportistas = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_transportistas_all]

              res.forEach((e: any) => {
                  this.datosFiltro.transportistas.push(e.id)
              })

              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerDepositos() {
      this.comunicacionService.getDB('depositos').subscribe(
          (res: any) => {
              this.db_depositos = res;
              this.load_depositos = false;
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerEstablecimientos() {
      this.comunicacionService.getDB('establecimientos').subscribe(
          (res: any) => {
              this.db_establecimientos = res;
              this.load_establecimientos = false;

              this.datos_filtrar_establecimientos = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_establecimientos]

              res.forEach((e: any) => {
                  this.datosFiltro.establecimientos.push(e.id)
              })

              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerGranos() {
      this.comunicacionService.getDB('granos').subscribe(
          (res: any) => {
              this.db_granos = res;
              this.load_granos = false;
              this.datos_filtrar_granos = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_granos]

              res.forEach((e: any) => {
                  this.datosFiltro.granos.push(e.id)
              })
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerOrdenesCarga() {
      this.comunicacionService.getDB('orden_carga').subscribe(
          (res: any) => {
              this.db_ordenes_carga = res;
              this.load_ordenes_carga = false;
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerIntervinientes() {
      this.comunicacionService.getDB('intervinientes').subscribe(
          (res: any) => {
              this.db_intervinientes = res;
              this.db_acopios = [...res.filter((e: any) => { return e.dstno == 1 })]
              this.db_corredores = [...res.filter((e: any) => { return e.corvtapri == 1 })]

              this.db_intervinientes.forEach((e: any) => {
                  this.datosFiltro.acopios.push(e.id)
                  this.datosFiltro.corredores.push(e.id)
              })

              this.datos_filtrar_corredores = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_intervinientes]
              this.datos_filtrar_acopios = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_intervinientes]

              this.intervinientesCPE = {
                  destinatario: [...res.filter((e: any) => { return e.dstro == 1 })],
                  destino: [...res.filter((e: any) => { return e.dstno == 1 })],
                  corredor_venta_primaria: [...res.filter((e: any) => { return e.corvtapri == 1 })],
                  corredor_venta_secundaria: [...res.filter((e: any) => { return e.corvtasec == 1 })],
                  mercado_a_termino: [...res.filter((e: any) => { return e.mertermino == 1 })],
                  remitente_comercial_venta_primaria: [...res.filter((e: any) => { return e.rtecomvtapri == 1 })],
                  remitente_comercial_venta_secundaria: [...res.filter((e: any) => { return e.rtecomvtasec == 1 })],
                  remitente_comercial_venta_secundaria2: [...res.filter((e: any) => { return e.rtecomvtasec2 == 1 })],
                  representante_entregador: [...res.filter((e: any) => { return e.rteent == 1 })],
                  representante_recibidor: [...res.filter((e: any) => { return e.rterec == 1 })],
                  remitente_comercial_productor: [...res.filter((e: any) => { return e.rtecomprod == 1 })],
                  intermediario_flete: [...res.filter((e: any) => { return e.intflet == 1 })],
                  pagador_flete: [...res.filter((e: any) => { return e.pagflet == 1 })],
                  chofer: [... this.db_choferes],
                  transportista: [... this.db_transportistas]
              }

              this.load_intervinientes = false;
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerMovimientos() {
      this.comunicacionService.getDB('movimientos').subscribe(
          (res: any) => {
              this.db_movimientos = res;
              this.load_movimientos = false;
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerCartasPorte() {
      this.comunicacionService.getDB('carta_porte').subscribe(
          (res: any) => {
              this.db_carta_porte = res;
              this.load_carta_porte = false;
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }
  obtenerOrdenesPago() {
      this.comunicacionService.getDB('orden_pago').subscribe(
          (res: any) => {
              this.db_ordenes_pago = res;
              this.load_ordenes_pago = false;
              this.datosParaTabla()
          },
          (err: any) => {
              console.log(err)
          }
      )
  }

  datosParaTabla() {

      if (!(this.load_camiones || this.load_choferes || this.load_socios || this.load_transportistas_all || this.load_depositos || this.load_establecimientos || this.load_granos || this.load_ordenes_carga || this.load_intervinientes || this.load_movimientos || this.load_carta_porte || this.load_ordenes_pago)) {

          this.dataParaMostrarTabla = []

          //FILTROS RAPIDOS (DATOS PARA FILTRAR)
          var ordenesPermitidas: any = []
          var cartaPortePermitidas: any = []
          var cartaPortePermitidas: any = []
          var camionesPermitidos: any = []

          if (this.filtroRapido.orden) {
              ordenesPermitidas = this.db_ordenes_carga.filter((odc: any) => { return odc.numero.includes(this.filtroRapido.orden) })
          }
          if (this.filtroRapido.cpe) {
              cartaPortePermitidas = this.db_carta_porte.filter((cdp: any) => { return cdp.nro_cpe.includes(this.filtroRapido.cpe) })
          }
          if (this.filtroRapido.ctg) {
              cartaPortePermitidas = this.db_carta_porte.filter((cdp: any) => { return cdp.nro_ctg.includes(this.filtroRapido.ctg) })
          }
          if (this.filtroRapido.patente) {
              camionesPermitidos = this.db_camiones.filter((camion: any) => { return camion.patente_chasis.includes(this.filtroRapido.patente.toUpperCase()) || camion.patente_acoplado.includes(this.filtroRapido.patente.toUpperCase()) })
          }


          this.db_movimientos.filter((mov:any) => { return ((!mov.kg_bruto && this.faltan_kg_bruto) || (!mov.kg_tara && this.faltan_kg_tara) || (!mov.kg_neto && this.faltan_kg_neto) || (!mov.kg_neto_final && this.faltan_kg_neto_final) || (!mov.kg_campo && this.faltan_kg_campo)) }).forEach((e: any) => {

              //FILTROS RAPIDOS
              var ok_filtrosRapidos = true

              if (this.filtroRapido.orden) {
                  ok_filtrosRapidos = ordenesPermitidas.some((odc: any) => { return odc.id_movimiento == e.id })
              }
              if (this.filtroRapido.cpe && ok_filtrosRapidos) {
                  ok_filtrosRapidos = cartaPortePermitidas.some((cdp: any) => { return cdp.id_movimiento == e.id })
              }
              if (this.filtroRapido.ctg && ok_filtrosRapidos) {
                  ok_filtrosRapidos = cartaPortePermitidas.some((cdp: any) => { return cdp.id_movimiento == e.id })
              }
              if (this.filtroRapido.patente && ok_filtrosRapidos) {
                  ok_filtrosRapidos = camionesPermitidos.some((camion: any) => { return camion.id == e.id_camion })
              }



              if (ok_filtrosRapidos) {
                  this.dataParaMostrarTabla.push(this.movimientoToMostrarTabla(e))
              }
          });
      }
  }
  movimientoToMostrarTabla(mov: any) {
      var dato: any = {
          id: mov.id,
          cultivo: mov.id_grano ? this.transformDatoTabla(mov.id_grano, "grano") : "-",
          fecha: mov.fecha ? this.transformDatoTabla(mov.fecha, "fecha") : "-",
          orden: this.transformDatoTabla(mov.id, "ordenNumero"),
          benef_orden: mov.id_socio ? this.transformDatoTabla(mov.id_socio, "socio") : "-",
          id_origen: mov.id_origen ? mov.id_origen : null,
          tipo_orig: mov.tipo_origen ? this.transformDatoTabla(mov.tipo_origen, "tipo_orig") : "-",
          pat: mov.id_camion ? this.transformDatoTabla(mov.id_camion, "pat") : "-",
          patAc: mov.id_camion ? this.transformDatoTabla(mov.id_camion, "patAc") : "-",
          transporte: mov.id_transporte ? this.transformDatoTabla(mov.id_transporte, "transporte") : "-",
          chofer: mov.id_chofer ? this.transformDatoTabla(mov.id_chofer, "chofer") : "-",
          id_corredor: mov.id_corredor ? this.transformDatoTabla(mov.id_corredor, "intervinientes") : "-",
          id_acopio: mov.id_acopio ? this.transformDatoTabla(mov.id_acopio, "intervinientes") : "-",
          id_deposito: mov.id_deposito ? mov.id_deposito : null,

          kg_tara: mov.kg_tara ? parseInt(mov.kg_tara) : null,
          kg_bruto: mov.kg_bruto ? parseInt(mov.kg_bruto) : null,
          kg_neto: mov.kg_neto ? parseInt(mov.kg_neto) : null,
          kg_regulacion: mov.kg_regulacion ? parseInt(mov.kg_regulacion) : null,
          kg_neto_final: mov.kg_neto_final ? parseInt(mov.kg_neto_final) : null,
          kg_campo: mov.kg_campo ? parseInt(mov.kg_campo) : null,

          observaciones: mov.observaciones ? mov.observaciones : "",

          permiteCrearCTG: true,
          existeOrdenDeCarga: this.db_ordenes_carga.some((e: any) => { return e.id_movimiento == mov.id }),

          cpe: '',
          benef: '',
          ctg: '',
      }


      if (this.db_carta_porte.some((e: any) => { return e.id_movimiento == mov.id })) {
          const carta_porte = this.db_carta_porte.filter((e: any) => { return e.id_movimiento == mov.id })
          if (carta_porte.length == 1) {
              var sucursal: any = carta_porte[0].sucursal ? carta_porte[0].sucursal.toString().padStart(2, '0') : ''
              var cpe: any = carta_porte[0].nro_cpe ? carta_porte[0].nro_cpe.toString().padStart(5, '0') : ''

              dato.cpe = sucursal + "-" + cpe
              dato.benef = carta_porte[0].cuit_solicitante ? this.transformDatoTabla(carta_porte[0].cuit_solicitante, "socioCuit") : "-"
              dato.ctg = carta_porte[0].nro_ctg ? carta_porte[0].nro_ctg : ''
              dato.permiteCrearCTG = false
          } else {
              var cpe: any = ""
              var benef: any = ""
              var ctg: any = ""
              carta_porte.forEach((e: any) => {
                  cpe += (e.sucursal ? e.sucursal.toString().padStart(2, '0') : '') + "-" + (e.nro_cpe ? e.nro_cpe.toString().padStart(5, '0') : '') + " "
                  ctg += (e.nro_ctg ? e.nro_ctg.toString() : '') + " "
                  benef = e.cuit_solicitante ? this.transformDatoTabla(e.cuit_solicitante, "socioCuit") : "-"
              })

              dato.cpe = cpe
              dato.benef = benef
              dato.ctg = ctg
              dato.permiteCrearCTG = false
          }
      }



      return dato
  }

  transformDatoTabla(dato: any, tipo: any, registro: any = 0) {
      if (tipo == 'grano') {
          return this.db_granos.some((e: any) => { return e.id == dato }) ? this.db_granos.find((e: any) => { return e.id == dato }).alias : '-'
      }
      if (tipo == 'fecha') {
          var fecha = new Date(dato)
          const datePipe = new DatePipe('en-US');
          return datePipe.transform(fecha, 'yyyy-MM-dd');
      }
      if (tipo == 'campo') {
          return this.db_establecimientos.some((e: any) => { return e.id == dato }) ? this.db_establecimientos.find((e: any) => { return e.id == dato }).alias : '-'
      }
      if (tipo == 'tipo_orig') {
          return this.optionsDe.some((e: any) => { return e.id == dato }) ? this.optionsDe.find((e: any) => { return e.id == dato }).label : '-'
      }
      if (tipo == 'pat') {
          return this.db_camiones.some((e: any) => { return e.id == dato }) ? this.db_camiones.find((e: any) => { return e.id == dato }).patente_chasis : '-'
      }
      if (tipo == 'patAc') {
          return this.db_camiones.some((e: any) => { return e.id == dato }) ? this.db_camiones.find((e: any) => { return e.id == dato }).patente_acoplado : '-'
      }
      if (tipo == 'transporte') {
          return this.db_transportistas_all.some((e: any) => { return e.id == dato }) ? this.db_transportistas_all.find((e: any) => { return e.id == dato }).alias : '-'
      }
      if (tipo == 'cuit_transp') {
          return this.db_transportistas_all.some((e: any) => { return e.id == dato }) ? this.db_transportistas_all.find((e: any) => { return e.id == dato }).cuit : '-'
      }
      if (tipo == 'chofer') {
          return this.db_choferes.some((e: any) => { return e.id == dato }) ? this.db_choferes.find((e: any) => { return e.id == dato }).alias : '-'
      }
      if (tipo == 'intervinientes') {
          return this.db_intervinientes.some((e: any) => { return e.id == dato }) ? this.db_intervinientes.find((e: any) => { return e.id == dato }).alias : '-'
      }
      if (tipo == 'kg') {
          return dato ? dato.toLocaleString("es-AR") : '-'
      }
      if (tipo == 'socio') {
          return this.db_socios.some((e: any) => { return e.id == dato }) ? this.db_socios.find((e: any) => { return e.id == dato }).alias : '-'
      }
      if (tipo == 'socioCuit') {
          return this.db_socios.some((e: any) => { return e.cuit.toString() == dato.toString() }) ? this.db_socios.find((e: any) => { return e.cuit.toString() == dato.toString() }).alias : '-'
      }
      if (tipo == 'ordenNumero') {
          if (this.db_ordenes_carga.some((e: any) => { return e.id_movimiento == dato })) {
              return this.db_ordenes_carga.find((e: any) => { return e.id_movimiento == dato }).numero
          } else {
              return ""
          }
      }
      if (tipo == 'moneda') {
          const number = parseFloat(dato);
          if (number == 0 || number == null || !number) {
              return ''
          }
          const options = {
              style: 'currency',
              currency: 'ARS',
              useGrouping: true,
              maximumFractionDigits: 2
          };
          return number.toLocaleString('es-AR', options);
      }
      return registro.id
  }

  calcularKilos(field:any, idd:any){
      setTimeout(() => {
          var movimiento = this.dataParaMostrarTabla.find((e:any) => { return e.id == idd })

          var kg_bruto:any = movimiento.kg_bruto ? parseInt(movimiento.kg_bruto) : 0
          var kg_tara:any = movimiento.kg_tara ? parseInt(movimiento.kg_tara) : 0
          var kg_neto:any = movimiento.kg_neto ? parseInt(movimiento.kg_neto) : 0
          var kg_regulacion:any = movimiento.kg_regulacion ? parseInt(movimiento.kg_regulacion) : 0

          if(field=='kg_bruto'){
              if(kg_tara){
                  movimiento.kg_neto = kg_bruto - kg_tara
              } else if (kg_neto) {
                  movimiento.kg_tara = kg_bruto - kg_neto
              }   
          }
          if(field=='kg_tara'){
              if(kg_bruto){
                  movimiento.kg_neto = kg_bruto - kg_tara
              } else {
                  movimiento.kg_neto = null
              }
          }
          if(field=='kg_neto'){
              if(kg_tara){
                  movimiento.kg_bruto = kg_tara + kg_neto
              }
          }
          
          if(movimiento.kg_neto){
              movimiento.kg_neto_final = movimiento.kg_neto + kg_regulacion
          } else {
              movimiento.kg_neto_final = null
          }

      }, 5)
  }

  guardarMovimiento(idd:any){
      if(confirm('Desea guardar cambios?')){
          this.datosMovimiento = this.db_movimientos.find((e:any) => { return e.id == idd })
          var movimiento = this.dataParaMostrarTabla.find((e:any) => { return e.id == idd })

          this.datosMovimiento.kg_bruto = movimiento.kg_bruto
          this.datosMovimiento.kg_tara = movimiento.kg_tara
          this.datosMovimiento.kg_neto = movimiento.kg_neto
          this.datosMovimiento.kg_neto_final = movimiento.kg_neto_final
          this.datosMovimiento.kg_campo = movimiento.kg_campo
          this.datosMovimiento.observaciones = movimiento.observaciones
          this.datosMovimiento.kg_regulacion = movimiento.kg_regulacion
          this.datosMovimiento.id_deposito = movimiento.id_deposito
          this.datosMovimiento.id_origen = movimiento.id_origen

          this.editarMovimiento()
      }
  }





  editarMovimiento() {
      this.comunicacionService.updateDB("movimientos", this.datosMovimiento).subscribe(
          (res: any) => {
              res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Editado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
              this.obtenerMovimientos()
          },
          (err: any) => {
              console.log(err)
              this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
          }
      )
  }

}