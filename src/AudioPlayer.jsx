import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from 'lucide-react';

export default function AudioPlayer({ 
  audioSrc, 
  title, 
  author, 
  onClose 
}) {
  const [audioRef] = useState(new Audio(audioSrc));
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Set up audio event listeners when component mounts
    audioRef.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.duration);
    });

    audioRef.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.currentTime);
      setProgress((audioRef.currentTime / audioRef.duration) * 100);
    });

    // Cleanup function
    return () => {
      audioRef.pause();
      audioRef.currentTime = 0;
      audioRef.removeEventListener('loadedmetadata', () => {});
      audioRef.removeEventListener('timeupdate', () => {});
    };
  }, [audioRef]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const seekBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const barWidth = seekBar.offsetWidth;
    const seekTime = (clickPosition / barWidth) * audioRef.duration;
    
    audioRef.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleSkip = (seconds) => {
    audioRef.currentTime = audioRef.currentTime + seconds;
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <Disc3 className={`w-12 h-12 text-pink-500 mr-4 ${isPlaying ? 'animate-spin' : ''}`} />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{author}</p>
        </div>
      </div>

      <div 
        className="w-full h-2 bg-gray-200 rounded-full cursor-pointer mb-4"
        onClick={handleSeek}
      >
        <div 
          className="h-2 bg-pink-500 rounded-full cursor-pointer" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-center space-x-6">
        <SkipBack 
          className="w-6 h-6 text-gray-500 hover:text-pink-500 cursor-pointer" 
          onClick={() => handleSkip(-10)} 
        />
        
        <button 
          onClick={handlePlayPause}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full hover:shadow-lg"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        
        <SkipForward 
          className="w-6 h-6 text-gray-500 hover:text-pink-500 cursor-pointer" 
          onClick={() => handleSkip(10)} 
        />

        <div className="flex items-center">
          <button onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-500 cursor-pointer" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-500 cursor-pointer" />
            )}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="ml-2 w-20 h-1 accent-pink-500"
          />
        </div>
      </div>
    </div>
  );
}
