from http.server import HTTPServer, BaseHTTPRequestHandler
import os
from aiohttp import web
from threading import Thread
import time
import socketio
import eventlet
import webbrowser

url = 'http://127.0.0.1:8000/'
chrome_path = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s'
 
class MyThread(Thread):
    def __init__(self, sio, sid):
        Thread.__init__(self)
        self.sio = sio
        self.sid = sid

    def run(self):
        while True:
            print("totot", self.sid)
            #self.sio.emit('reply', room=self.sid)
            self.sio.emit('reply', "yoyoy", broadcast=True)
            time.sleep(1)
            # call a function

class StaticServer(BaseHTTPRequestHandler):
 
    def do_GET(self):
        root = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'testgame/dist')
        #print(self.path)
        if self.path == '/':
            filename = root + '\index.html'
        else:
            filename = root + self.path
 
        self.send_response(200)
        if filename[-4:] == '.css':
            self.send_header('Content-type', 'text/css')
        elif filename[-5:] == '.json':
            self.send_header('Content-type', 'application/javascript')
        elif filename[-3:] == '.js':
            self.send_header('Content-type', 'application/javascript')
        elif filename[-4:] == '.ico':
            self.send_header('Content-type', 'image/x-icon')
        else:
            self.send_header('Content-type', 'text/html')
        self.end_headers()
        with open(filename, 'rb') as fh:
            html = fh.read()
            #html = bytes(html, 'utf8')
            self.wfile.write(html)

class runWeb(Thread):
    def __init__(self):
        Thread.__init__(self)      

    def run(self):
        server_address = ('', 8000)
        httpd = HTTPServer(server_address, StaticServer)
        print('Starting httpd on port {}'.format(8000))
        httpd.serve_forever()

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
    thread = runWeb()
    thread.start()  
    webbrowser.get(chrome_path).open(url)
    main()
    
