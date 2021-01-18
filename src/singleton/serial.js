const SerialPort = require('serialport')

let port= null

export async function listPort()
{
    const sp = await import('serialport')
       
    sp.list(function (error, ports) {
        if (error) {
          /* eslint-disable no-console */
          return error
        } else {
          /* eslint-disable no-console */
          return ports   
        }
      })
}


export function selectPort(comPort)
{
    port=new SerialPort(comPort, {
        baudRate: 9600
      })
}

export function write(data)
{
    port.write(data, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log('message written')
      })
}

export function init()
{
// Open errors will be emitted as an error event
port.on('error', function(err) {
    console.log('Error: ', err.message)
  })
  
  //lit des données sur le port serie
  port.on('readable', function () {
      console.log('Data:', port.read())
  })
}




export default port;