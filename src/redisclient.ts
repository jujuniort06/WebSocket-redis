import { Socket } from "net";
const RedisServer = require('redis-server');

const net = require('net');

enum RedisMethods {
  SET,
  GET,
  DEL
}

export class RedisClient{   
  
  private server : Socket;

  private resolvePromisse : any;
  private rejectPromisse  : any;

  private callbackSet : any;
  private callbackGet : any;
  private callbackDel : any;

  constructor(){
    this.server = new net.Socket();
    this.registerMethods();
  }
    
  private registerMethods(){
    // Registrando CALLBACK do método SET
    this.callbackSet = (data : any) => {
      console.log('data do SET');
      this.removeCallBack(RedisMethods.SET);
  
      if (data == undefined || data == null){
        this.rejectPromisse();
      }
  
      this.resolvePromisse(data);
    }

    // Registrando CALLBACK do método GET
    this.callbackGet = (data : any) => {
      console.log('data do GET');
      this.removeCallBack(RedisMethods.GET);
      if (data == undefined || data == null){
        this.rejectPromisse();
      }
  
      this.resolvePromisse(data);
    }

    // Registrando CALLBACK do método DEL
    this.callbackDel = (data : any) => {
      console.log('data do DEL');
      this.removeCallBack(RedisMethods.DEL);
      if (data == undefined || data == null){
        this.rejectPromisse();
      }
  
      this.resolvePromisse(data);
    }
  }
  
  public connect(port : number, ip : string) : Promise<any>{
    return new Promise((resolve, reject) => {
      this.server.connect(port, ip, () =>{
        resolve();

        return;
      });

      this.server.on('timeout', () => {
        reject();

        return;
      });
    });
  }  

  public get(key : string) : Promise<any>{
    this.server.write('*2\r\n$3\r\nGET\r\n$' + key.length + '\r\n'+ key +'\r\n');

    return new Promise((resolve, reject) => {
      this.resolvePromisse = resolve;
      this.rejectPromisse  = reject;
      this.server.on('data', this.callbackGet);
    });
  }

  public set(key : string, value : string) : Promise<any>{
    this.server.write('*3\r\n$3\r\nSET\r\n$' + key.length + '\r\n'+ key +'\r\n$'+ value.length +'\r\n'+ value +'\r\n');   

    return new Promise((resolve, reject) => {      
      this.resolvePromisse = resolve;
      this.rejectPromisse  = reject;
      this.server.on('data', this.callbackSet);
    });
  }

  public removeCallBack(redismethods : RedisMethods){
    if (redismethods == RedisMethods.SET){
      this.server.removeListener('data', this.callbackSet);
    }

    if (redismethods == RedisMethods.GET){
      this.server.removeListener('data', this.callbackGet);
    }

    if (redismethods == RedisMethods.DEL){
      this.server.removeListener('data', this.callbackDel);
    }
  }

  public del(key : string) : Promise<any>{
    this.server.write('*2\r\n$3\r\nDEL\r\n$' + key.length + '\r\n'+ key +'\r\n');

    return new Promise((resolve, reject) => {
      this.resolvePromisse = resolve;
      this.rejectPromisse  = reject;
      this.server.on('data', this.callbackDel);
    })
  }
}