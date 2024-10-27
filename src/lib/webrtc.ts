import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

export interface PeerConnection {
  peer: Peer.Instance;
  stream: MediaStream;
}

export const createPeer = (
  userToSignal: string,
  callerId: string,
  stream: MediaStream,
  socket: Socket
): Peer.Instance => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });

  peer.on('signal', (signal) => {
    socket.emit('sending signal', {
      userToSignal,
      callerId,
      signal,
    });
  });

  return peer;
};

export const addPeer = (
  incomingSignal: Peer.SignalData,
  callerId: string,
  stream: MediaStream,
  socket: Socket
): Peer.Instance => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
  });

  peer.on('signal', (signal) => {
    socket.emit('returning signal', { signal, callerId });
  });

  peer.signal(incomingSignal);

  return peer;
};