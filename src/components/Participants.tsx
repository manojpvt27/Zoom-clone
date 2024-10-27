import React from 'react';
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

interface ParticipantsProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
}

const Participants: React.FC<ParticipantsProps> = ({ isOpen, onClose, participants }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-semibold">Participants ({participants.length})</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="p-4 border-b flex items-center justify-between"
          >
            <span className="font-medium">{participant.name}</span>
            <div className="flex space-x-2">
              {participant.isAudioEnabled ? (
                <Mic className="w-5 h-5 text-gray-600" />
              ) : (
                <MicOff className="w-5 h-5 text-red-500" />
              )}
              {participant.isVideoEnabled ? (
                <Video className="w-5 h-5 text-gray-600" />
              ) : (
                <VideoOff className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;