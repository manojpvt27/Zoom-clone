import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import VideoPlayer from './components/VideoPlayer';
import Controls from './components/Controls';
import Chat from './components/Chat';
import Participants from './components/Participants';
import { Video } from 'lucide-react';
import { useMediaStream } from './hooks/useMediaStream';
import { createPeer, addPeer, PeerConnection } from './lib/webrtc';

const socket = io('https://your-signaling-server.com');

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface Participant {
  id: string;
  name: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

function App() {
  const { stream, error: mediaError } = useMediaStream();
  const [peers, setPeers] = useState<{ [key: string]: PeerConnection }>({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!stream || !userName) return;

    socket.on('user joined', ({ signal, callerId }) => {
      const peer = addPeer(signal, callerId, stream, socket);
      setPeers((peers) => ({
        ...peers,
        [callerId]: { peer, stream: peer.streams[0] },
      }));
    });

    socket.on('receiving returned signal', ({ signal, id }) => {
      peers[id].peer.signal(signal);
    });

    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('user joined');
      socket.off('receiving returned signal');
      socket.off('message');
    };
  }, [stream, userName]);

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const leaveCall = () => {
    Object.values(peers).forEach(({ peer }) => peer.destroy());
    setPeers({});
    socket.disconnect();
    setUserName('');
    setRoomId('');
  };

  const sendMessage = (content: string) => {
    const message: Message = {
      sender: userName,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    socket.emit('message', { roomId, message });
  };

  const joinRoom = () => {
    const newRoomId = roomId || uuidv4();
    setRoomId(newRoomId);
    socket.emit('join room', { roomId: newRoomId, userName });
  };

  if (mediaError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-red-500 mb-4">Media Access Error</h1>
          <p className="text-gray-700">{mediaError.message}</p>
        </div>
      </div>
    );
  }

  if (!userName) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <div className="flex items-center justify-center mb-8">
            <Video className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Join Meeting</h1>
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Room ID (optional)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinRoom}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Meeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stream && (
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <VideoPlayer stream={stream} muted />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
              You
            </div>
          </div>
        )}
        {Object.entries(peers).map(([peerId, { stream }]) => (
          <div
            key={peerId}
            className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
          >
            <VideoPlayer stream={stream} />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
              Participant
            </div>
          </div>
        ))}
      </div>

      <Controls
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveCall={leaveCall}
        toggleChat={() => setIsChatOpen(!isChatOpen)}
        toggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
      />

      <Chat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={sendMessage}
      />

      <Participants
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
        participants={participants}
      />
    </div>
  );
}

export default App;