import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onClose: () => void;
}

export const AudioRecorder = ({ onRecordingComplete, onClose }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const sendRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background border border-border rounded-xl shadow-lg p-4 min-w-[280px]">
      <div className="flex flex-col gap-4">
        {/* Recording Status */}
        <div className="text-center">
          {isRecording ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
              <span className="text-sm font-medium">Gravando... {formatTime(recordingTime)}</span>
            </div>
          ) : audioBlob ? (
            <span className="text-sm text-muted-foreground">Gravação concluída ({formatTime(recordingTime)})</span>
          ) : (
            <span className="text-sm text-muted-foreground">Pressione para gravar</span>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center gap-2">
          {!isRecording && !audioBlob && (
            <Button
              onClick={startRecording}
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="h-12 w-12 rounded-full"
            >
              <Square className="h-5 w-5" />
            </Button>
          )}

          {audioBlob && !isRecording && (
            <Button
              onClick={playAudio}
              variant="outline"
              className="h-12 w-12 rounded-full"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Audio Element */}
        {audioBlob && (
          <audio
            ref={audioRef}
            src={URL.createObjectURL(audioBlob)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
          
          {audioBlob && (
            <Button
              onClick={sendRecording}
              className="flex-1"
            >
              Enviar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};