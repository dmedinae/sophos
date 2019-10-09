import { Component, OnInit } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";

@Component({
  selector: "app-inform",
  templateUrl: "./inform.component.html",
  styleUrls: ["./inform.component.scss"]
})
export class InformComponent implements OnInit {
  pedidos;
  showGraph = false;
  titleGraph;
  dataGraph = [];
  private cities = [
    { municipio: "Medellín" },
    {
      municipio: "Abejorral"
    },
    {
      municipio: "Abriaquí"
    },
    {
      municipio: "Alejandría"
    },
    {
      municipio: "Amagá"
    },
    {
      municipio: "Amalfi"
    },
    {
      municipio: "Andes"
    },
    {
      municipio: "Angelópolis"
    },
    {
      municipio: "Angostura"
    },
    {
      municipio: "Anorí"
    },
    {
      municipio: "Chimá"
    },
    {
      municipio: "Anza"
    },
    {
      municipio: "Apartadó"
    },
    {
      municipio: "Arboletes"
    },
    {
      municipio: "Argelia"
    },
    {
      municipio: "Armenia"
    },
    {
      municipio: "Barbosa"
    },
    {
      municipio: "Bello"
    },
    {
      municipio: "Betania"
    },
    {
      municipio: "Betulia"
    },
    {
      municipio: "Ciudad Bolívar"
    }
  ];

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.pedidos = this.productService.readLocalStorage('pedidos');
    if(this.pedidos) {
      this.cities.forEach(city => {
        let pedidosByCity = this.pedidos.filter(pedido => pedido['ciudad'] == city['municipio']);
        console.log(city['municipio'], pedidosByCity.length)
        if (pedidosByCity.length > 0) {
          this.dataGraph.push({ name: city['municipio'], count: pedidosByCity.length })
        }
      });
    }
    this.titleGraph = "Pedidos por ciudad";

    this.showGraph = true;
  }
}
