let port= null

export async function listPort()
{

    return new Promise(function(resolve, reject) {
        const sp = require('serialport')
        sp.list(function (error, ports) {
            if (error) {
              /* eslint-disable no-console */
              return reject(error)
            } else {
              /* eslint-disable no-console */
              return resolve(ports)  
            }
          })
      })
   
}


export function selectPort(comPort)
{
    const SerialPort = require('serialport')
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