import socketio
import eventlet

socket = socketio.Server(async_mode='eventlet', cors_allowed_origins='*')
app = socketio.WSGIApp(socket)

@socket.on('connect')
def connect(sid, environ):
    print("connect ", sid)
  
@socket.on('message')
async def message(sid, data):
    print("message ", data)
    print("sid",sid)
    await socket.emit('reply', "yoyoy", broadcast=True)

@socket.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)

def worker1():
    eventlet.wsgi.server(eventlet.listen(('', 5030)), app)

def worker2():
    while(1):
        print("send clock")
        socket.emit('reply', '1 sec')
        socket.sleep(1)

def main():
    socket.start_background_task(worker2)
    worker1()

if __name__ == '__main__':
    main()
