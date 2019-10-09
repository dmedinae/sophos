import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CookieService } from "ngx-cookie-service";
import { HttpClientModule } from "@angular/common/http";
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { AppMaterialModule } from "./app-material/app-material.module";

import { MAT_DATE_LOCALE } from "@angular/material"; //idioma date picker
import { DataTableComponent } from "./shared/data-table/data-table.component";
import { GraphsComponent } from "./shared/graphs/graphs.component";
import { DialogTemplateComponent } from "./shared/dialog-template/dialog-template.component";
import { ProductsComponent } from "./components/products/products.component";
import { ImagesComponent } from "./components/images/images.component";
import { CarComponent } from "./components/car/car.component";
import { FormComponent } from "./components/form/form.component";
import { OrderComponent } from "./components/order/order.component";
import { DetailsComponent } from "./components/details/details.component";
import { InformComponent } from "./components/inform/inform.component";
import { LoadingComponent } from "./shared/loading/loading.component";

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    GraphsComponent,
    DialogTemplateComponent,
    ProductsComponent,
    ImagesComponent,
    CarComponent,
    FormComponent,
    OrderComponent,
    DetailsComponent,
    InformComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AmChartsModule,
    AppMaterialModule
  ],
  providers: [
    CookieService,
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" } //ESPAÑOL idioma date picker
  ],
  entryComponents: [
    ImagesComponent,
    FormComponent,
    DetailsComponent,
    LoadingComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
