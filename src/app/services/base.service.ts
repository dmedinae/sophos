import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import * as crypto from 'crypto-js';
import { map, switchMap, catchError } from 'rxjs/operators';
import { isUndefined } from 'util';
import { throwError } from 'rxjs';

export abstract class BaseService {
  HttpUrl = environment.HttpUrl;
  refreshUrl = environment.refreshUrl;
  refreshKey = environment['refreshKey'] ? environment["refreshKey"] : '9163';
  tokenKey = environment['tokenKey'] ? environment["tokenKey"] : '1524';
  optionsToUse: Options;
  optionsDefault: Options = {
    url: 0,
    header: true,
    encrypt: true,
    token: ''
  }

  errosMsg = {};

  msgAlertToken = `Ha ocurrido un error al renovar tus credenciales de inicio de sesión.

Recuerda que sólo puedes abrir tu cuenta desde un dispositivo a la vez.
CIERRA TU SESIÓN ACTUAL E INGRESA DE NUEVO.`;

  constructor(private http: HttpClient, private _cookieService: CookieService) { }

  public deleteAllCookies(){
    this._cookieService.deleteAll('/');
  }
  public clearLocalStorage(){
    localStorage.clear();
  }
  public clearSessionStorage(){
    sessionStorage.clear();
  }

  public isLogged(): boolean{
    console.log("islogged()",this.readCookie(""))
    if(this.readCookie("") == null || isUndefined(this.readCookie(""))){
      return false
    }else{
      return true
    }
  }

  //desencriptar mensajes de error
  /** Devuelve el mensaje de error desencriptado
   * @param  {} data Respuesta de error del servicio
   */
  public errorDecrypt(data) {
    let error = JSON.parse(this.decrypt(data['error']['data']));
    return JSON.parse(error['message']);
  }

  //Métodos para manejar almacenamiento
  public setLocalStorage(key: string, data) {
    this.setStorage(0, key, data);
  }

  public readLocalStorage(key: string) {
    return this.readStorage(0, key);
  }

  public deleteLocalStorage(key: string) {
    this.deleteStorage(0, key);
  }

  public setSesionStorage(key: string, data) {
    this.setStorage(1, key, data);
  }

  public readSesionStorage(key: string) {
    return this.readStorage(1, key);
  }

  public deleteSesionStorage(key: string) {
    this.deleteStorage(1, key);
  }

  public setCookie(key: string, data, expires = 0) {
    this.setStorage(2, key, data, expires);
  }

  public readCookie(key: string) {
    return this.readStorage(2, key);
  }

  public deleteCookie(key: string) {
    this.deleteStorage(2, key);
  }

  private storageKey(key: string) {
    return key === "" ? this.tokenKey : key;
  }

  private setStorage(location: number, key: string, value, expires = 0) {
    let data = JSON.stringify(value);
    let encryptedData = crypto.AES.encrypt(data.toString(), "9e7j0c7n2o1k0e3y6j0a6");
    key = this.storageKey(key);
    switch (location) {
      case 0:
        localStorage.removeItem(key);
        localStorage.setItem(key, encryptedData);
        break;
      case 1:
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, encryptedData);
        break;
      case 2:
        if (key == this.tokenKey) {
          let date = new Date();
          let time = date.getTime();
          time += (value['token']['expires_in']*1000);
          date.setTime(time);
          this._cookieService.set(this.refreshKey, '', date, '/');
        }
        this._cookieService.delete(key, '/');
        this._cookieService.set(key, encryptedData, expires, '/');
        break;
      default:
        break;
    }

  }

  private readStorage(location: number, key: string) {
    key = this.storageKey(key);
    let encryptedData;
    switch (location) {
      case 0:
        encryptedData = localStorage.getItem(key);
        break;
      case 1:
        encryptedData = sessionStorage.getItem(key);
        break;
      case 2:
        encryptedData = this._cookieService.get(key);
        break;
      default:
        break;
    }
    if (encryptedData) {
      let decryptedData = crypto.AES.decrypt(encryptedData, "9e7j0c7n2o1k0e3y6j0a6");
      return JSON.parse(decryptedData.toString(crypto.enc.Utf8));
    }
    return null;
  }

  private deleteStorage(location: number, key: string) {
    key = this.storageKey(key);
    switch (location) {
      case 0:
        localStorage.removeItem(key);
        break;
      case 1:
        sessionStorage.removeItem(key);
        break;
      case 2:
        if(key == this.tokenKey) {
          this._cookieService.delete(this.refreshKey, '/');
        }
        this._cookieService.delete(key, '/');
        break;
      default:
        break;
    }
  }

  //Método para poner el token en el header
  private setToken(token: string) {
    const data = this.readCookie(this.storageKey(""));
    const TOKEN = token ? token : data['token']['access_token'];
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${TOKEN}`
      })
    };
    return httpOptions;
  }

  //Métodos para manejar las opciones
  /** Funcion para poner las opciones
   * @param  {number} url num del array en el http
   * @param  {boolean=true} headers si se envían headers como token, etc...
   * @param  {boolean=true} encrypt si se encripta
   * @param  {string=''} token token manual
   */
  protected setOptions(url: number, headers: boolean = true, encrypt: boolean = true, token: string = '') {
    const OPTIONS: Options = {
      url: url,
      header: headers,
      encrypt: encrypt,
      token: token
    }
    return OPTIONS;
  }

  private setData(options: Options, data?) {
    this.optionsToUse = options ? options : this.optionsDefault;
    const httpurl = this.HttpUrl[this.optionsToUse.url];
    const httpOptions = this.optionsToUse.header ? this.setToken(this.optionsToUse.token) : {};
    const httpData = data ? this.returnDataEncrypt(this.optionsToUse.encrypt, data) : {};
    return { httpurl: httpurl, httpOptions: httpOptions, httpData: httpData };
  }

  private returnDataDecrypt(encrypt: boolean, data) {
    return encrypt && data ? JSON.parse(this.decrypt(data['data'])) : data;
  }

  private returnDataEncrypt(encrypt: boolean, data) {
    return encrypt ? this.encrypt(JSON.stringify(data)) : data;
  }

  //Métodos REST
  protected get(url: string, options?: Options) {
    return this.sendRequest('getValidate', url, {}, options);
  }

  protected post(url: string, data: any, options?: Options) {
    return this.sendRequest('postValidate', url, data, options);
  }

  protected put(url: string, data: any, options?: Options) {
    return this.sendRequest('putValidate', url, data, options);
  }

  protected delete(url: string, options?: Options) {
    return this.sendRequest('deleteValidate', url, {}, options);
  }

  protected downloadFile(url: string, data: any, options?: Options) {
    return this.sendRequest('downloadFileValidate', url, data, options);
  }

  //Métodos REST validados
  private getValidate(url, requestData) {
    return this.http.get(requestData['httpurl'] + url, requestData['httpOptions']).pipe(map(answer => {
      return this.returnDataDecrypt(this.optionsToUse.encrypt, answer);
    }));
  }

  private postValidate(url, requestData) {
    return this.http.post(requestData['httpurl'] + url, requestData['httpData'], requestData['httpOptions']).pipe(map(answer => {
      return this.returnDataDecrypt(this.optionsToUse.encrypt, answer);
    }));
  }

  private putValidate(url, requestData) {
    return this.http.put(requestData['httpurl'] + url, requestData['httpData'], requestData['httpOptions']).pipe(map(answer => {
      return this.returnDataDecrypt(this.optionsToUse.encrypt, answer);
    }));;
  }

  private deleteValidate(url, requestData) {
    return this.http.delete(requestData['httpurl'] + url, requestData['httpOptions']).pipe(map(answer => {
      return this.returnDataDecrypt(this.optionsToUse.encrypt, answer);
    }));
  }

  private downloadFileValidate(url, requestData) {
    requestData['httpOptions']['headers'].append('responseType', 'blob');
    return this.http.post(requestData['httpurl'] + url, requestData['httpData'], { headers: requestData['httpOptions']['headers'], responseType: 'blob' as 'json' }).pipe(map(answer => {
      return answer;
    }));
  }

  private sendRequest(type: string, url: string, data: any, options?: Options) {
    let requestData = this.setData(options, data);
    if (this.optionsToUse.header && !this.optionsToUse.token && !this._cookieService.check(this.refreshKey)) {
      const DATA = this.readCookie(this.storageKey(""));
      const REFRESH = { refresh: DATA['token']['refresh_token'] };
      return this.http.post(this.refreshUrl, REFRESH).pipe(switchMap(data => {
        DATA['token'] = data['token'];
        this.setCookie('', DATA);
        requestData['httpOptions'] = this.setToken('');
        return this[type](url, requestData);
      }),
        catchError((error: HttpErrorResponse) => {
          if (error.url == this.refreshUrl) { //para prevenir si el error es con la petición del return this[type](url, requestData);
            this.closeSession();
          } else {
            return throwError(error);  //llega donde se llame (.subscribe) como error
          }
        })
      );
    }
    return this[type](url, requestData);
  }

  /**Cerrrar cesión por error de refreshToken
   */
  private closeSession() {
    this.clearLocalStorage();
    this.clearSessionStorage();
    this.deleteAllCookies();

    alert(this.msgAlertToken);
    window.location.reload(); //no cerrar porque la app no se abrió desde el login
  }

  private encrypt(value) {
    const data = this.readCookie(this.storageKey(""));
    var key = crypto.enc.Hex.parse(data['key']);
    var iv = crypto.enc.Hex.parse('0000000000000000');
    var encrypted = crypto.AES.encrypt(crypto.enc.Utf8.parse(value.toString()), key,
      {
        iv: iv,
        mode: crypto.mode.CBC,
        padding: crypto.pad.ZeroPadding
      });
    const DATA = { data: encrypted.toString() };
    return DATA;
  }

  private decrypt(value) {
    const data = this.readCookie(this.storageKey(""));
    var key = crypto.enc.Hex.parse(data['key']);
    var iv = crypto.enc.Hex.parse('0000000000000000');
    var decrypted = crypto.AES.decrypt(value, key, {
      iv: iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.ZeroPadding
    });
    return decrypted.toString(crypto.enc.Latin1);
  }

  public error(value) {
    const errors = JSON.parse(this.decrypt(value.error['data']));
    return isUndefined(this.errosMsg[errors['message']]) ? errors['message'] : this.errosMsg[errors['message']];
  }
}

interface Options {
  url: number;
  encrypt: boolean;
  header: boolean;
  token: string;
}