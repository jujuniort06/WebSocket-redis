import { Socket } from "net";
const RedisServer = require('redis-server');

const net = require('net');

export class RedisClient{   
  
  private server : Socket;

  constructor(){
    this.server = new net.Socket();
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
      this.server.on('data', (data) => {
        if (data == undefined || data == null){
          reject();
        }

        resolve(data);
      });
    });
  }

  public set(key : string, value : string) : Promise<any>{
    this.server.write('*3\r\n$3\r\nSET\r\n$' + key.length + '\r\n'+ key +'\r\n$'+ value.length +'\r\n'+ value +'\r\n');

    return new Promise((resolve, reject) => {
      this.server.on('data', (data) => {
        if (data == undefined || data == null){
          reject();
        }

        resolve(data);
      });
    });
  }

  public del(key : string) : Promise<any>{
    this.server.write('*2\r\n$3\r\nDEL\r\n$' + key.length + '\r\n'+ key +'\r\n');

    return new Promise((resolve, reject) => {
      this.server.on('data', (data) => {
        if (data == undefined || data == null){
          reject();
        }

        resolve(data);
      });
    })
  }
}