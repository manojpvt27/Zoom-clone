import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageCircle } from 'lucide-react';

interface ControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  leaveCall: () => void;
  toggleChat: () => void;
  toggleParticipants: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  toggleAudio,
  toggleVideo,
  leaveCall,
  toggleChat,
  toggleParticipants,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center space-x-6">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${
            isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isAudioEnabled ? (
            <Mic className="w-6 h-6 text-white" />
          ) : (
            <MicOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isVideoEnabled ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <VideoOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={leaveCall}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={toggleChat}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={toggleParticipants}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          <Users className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Controls;