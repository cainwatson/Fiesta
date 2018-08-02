import feathers from '@feathersjs/client';
import auth from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

const server = process.env.NODE_ENV === 'production'
  ? 'http://ec2-18-222-29-20.us-east-2.compute.amazonaws.com'
  // : 'http://192.168.0.20:3030'; // ANDY
  : 'http://192.168.0.2:3030'; // HOME
  // : 'http://192.168.99.1:3030'; // HOME ?
  // : 'http://192.168.1.64:3030'; // OPSPARK ATT
  // : 'http://172.24.4.60:3030'; // OPSPARK NON-COX
  // : 'http://192.168.43.86:3030'; // ELIJAH HOTSPOT
  // : 'http://192.168.0.190:3030'; // JAZZ MARKET


console.log('USING SERVER:', server);

export const socket = io(server);
export const app = feathers();

app.configure(auth({ storage: window.localStorage }));
app.configure(socketio(socket));

app.service('media').timeout = 600000;
app.service('game').timeout = 600000;
