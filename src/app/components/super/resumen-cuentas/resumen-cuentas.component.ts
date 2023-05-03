import { Component } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-resumen-cuentas',
    templateUrl: './resumen-cuentas.component.html',
    styleUrls: ['./resumen-cuentas.component.css']
})
export class ResumenCuentasComponent {

    db_socios: any = []
    db_asientos: any = []
    db_transportistas: any = []

    load_asientos: boolean = true
    load_socios: boolean = true
    load_transportistas: any = true

    socioSeleccionado: any = ''

    datosCuentasTransportistas: any = []
    datosCuentaCorrienteTotales: any = {
        ingreso: 0,
        gasto: 0,
        saldo: 0
    }

    selectCtasSinMov: boolean = false
    selectCtasCero: boolean = false
    selectCtasAcreedoras: boolean = true
    selectCtasDeudoras: boolean = true

    ordenarPor: any = 'razon_social'

    constructor(
        private loginService: LoginService,
        private comunicacionService: ComunicacionService
    ) { }

    ngOnInit() {
        this.loginService.verificarSessionSuperUsuario();

        this.obtenerSocios()
        this.obtenerAsientos()
        this.obtenerTransportistas()
    }
    obtenerSocios() {
        this.comunicacionService.getDB("socios").subscribe(
            (res: any) => {
                this.db_socios = res;
                this.load_socios = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerAsientos() {
        this.comunicacionService.getDB('asientos').subscribe(
            (res: any) => {
                this.db_asientos = res;
                this.load_asientos = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerTransportistas() {
        this.comunicacionService.getDB('transportistas').subscribe(
            (res: any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }


    buscarSaldosTransportistas(){
        this.datosCuentasTransportistas = []

        var totalIngreso= 0;
        var totalGasto= 0;
        var totalSaldo= 0;
        //RECORREMOS LOS TRANSPORTISTAS:
        //POR CADA UNO BUSCAMOS SUS MOVIMIENTOS CON EL SOCIO SELECCIONADO
        this.db_transportistas.forEach((transportista:any) => {
            var movimientos = this.db_asientos.filter((e:any) => { return (e.id_socio == this.socioSeleccionado) && (e.id_transportista == transportista.id) })

            if(movimientos.length > 0){
                var ingresos:any = 0
                var gastos:any = 0
                var saldo:any = 0

                movimientos.forEach((e:any) => {
                    const haber = e.haber ? parseFloat(e.haber) : 0;
                    const debe = e.debe ? parseFloat(e.debe) : 0;

                    ingresos += haber
                    gastos += debe
                    saldo = saldo + haber - debe

                });
                if((saldo == 0 && this.selectCtasCero) || (saldo < 0 && this.selectCtasDeudoras) || (saldo > 0 && this.selectCtasAcreedoras)){
                    this.datosCuentasTransportistas.push(
                        {
                            codigo: transportista.codigo,
                            razon_social: transportista.razon_social,
                            cuit: transportista.cuit,
                            ingreso: ingresos,
                            gasto: gastos,
                            saldo: saldo
                        }
                    )

                    totalIngreso += ingresos
                    totalGasto += gastos
                    totalSaldo = totalSaldo + ingresos - gastos
                }
            } else if(this.selectCtasSinMov && this.socioSeleccionado){
                this.datosCuentasTransportistas.push(
                    {
                        codigo: transportista.codigo,
                        razon_social: transportista.razon_social,
                        cuit: transportista.cuit,
                        ingreso: 0,
                        gasto: 0,
                        saldo: 0
                    }
                )
            }
        });

        this.datosCuentaCorrienteTotales = {
            ingreso: totalIngreso,
            gasto: totalGasto,
            saldo: totalSaldo
        }

        //ORDENAMOS
        this.datosCuentasTransportistas.sort((a:any, b:any) => {
            if (a[this.ordenarPor] < b[this.ordenarPor]) return -1;
            if (a[this.ordenarPor] > b[this.ordenarPor]) return 1;
            return 0;
        });
        
    }




    transformarDatoMostrarTabla(dato: any, tipo: any) {
        if (tipo == 'moneda') {
            const number = parseFloat(dato);
            if (number == 0) {
                return '$ 0'
            }
            if (number == null || !number) {
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
        if (tipo=='socio'){

            return this.db_socios.some((e:any) => { return e.id == dato }) ? this.db_socios.find((e:any) => { return e.id == dato }).razon_social : ''
        }

        return dato
    }


}
