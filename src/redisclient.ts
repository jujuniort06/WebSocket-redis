import { Socket } from "net";
const RedisServer = require('redis-server');

const net = require('net');

export class RedisClient{   
  
  private server    : Socket;

  constructor(){
    this.server = new net.Socket();
  }
    
  public connect(port : number, ip : string, callback : any){
    this.server.connect(port, ip, () =>{
      callback();
    })   

    this.server.on('data', (data) => {  
      console.log(data.toString());
    });

    this.server.on('close', () => {
      console.log('Fechou a conexão');
    })
  }

  public get(key : string){
    this.server.write('*2\r\n$3\r\nGET\r\n$' + key.length + '\r\n'+ key +'\r\n');
  }

  public set(key : string, value : string){
    this.server.write('*3\r\n$3\r\nSET\r\n$' + key.length + '\r\n'+ key +'\r\n$'+ value.length +'\r\n'+ value +'\r\n');
  }

  public del(key : string){
    this.server.write('*2\r\n$3\r\nDEL\r\n$' + key.length + '\r\n'+ key +'\r\n');
  }
}