
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { voiceLogin } from '../services/api';
import { User } from '../types';
import Spinner from './Spinner';

interface VoiceRecorderProps {
    email: string;
    onClose: () => void;
    onLogin: (token: string, user: User) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ email, onClose, onLogin }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        setError(null);
        setAudioURL('');
        setAudioBlob(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                setAudioBlob(blob);
                audioChunksRef.current = [];
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            // Stop all media tracks to turn off the mic indicator
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };
    
    const handleLogin = async () => {
        if (!audioBlob || !email) {
            setError("No recording or email available.");
            return;
        }
        
        setError(null);
        setIsLoading(true);
        
        const formData = new FormData();
        formData.append('email', email);
        formData.append('voiceSample', audioBlob, 'voiceSample.wav');
        
        try {
            const { token, user } = await voiceLogin(formData);
            onLogin(token, user);
            onClose();
        } catch (err: any) {
            setError(err.message || "Voice login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-secondary p-8 rounded-lg shadow-xl w-full max-w-md m-4">
                <h2 className="text-2xl font-bold text-white mb-4">Voice Login</h2>
                {error && <p className="text-red-400 bg-red-900 p-3 rounded-md mb-4">{error}</p>}
                
                <div className="flex flex-col items-center justify-center space-y-6">
                    {!isRecording && !audioURL && (
                        <button onClick={startRecording} className="p-6 bg-cyan-600 rounded-full text-white hover:bg-cyan-700 transition-all duration-300">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 10.724a.75.75 0 01-1.5 0V14a5 5 0 00-10 0v.724a.75.75 0 01-1.5 0V14a6.5 6.5 0 1113 0v.724z" clipRule="evenodd" /></svg>
                        </button>
                    )}
                     {isRecording && (
                        <button onClick={stopRecording} className="p-6 bg-red-600 rounded-full text-white hover:bg-red-700 animate-pulse transition-all duration-300">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><rect width="10" height="10" x="5" y="5" rx="1"/></svg>
                        </button>
                    )}
                    <p className="text-highlight">
                        {isRecording ? "Recording..." : audioURL ? "Recording complete." : "Tap to record your voice."}
                    </p>
                    
                    {isLoading && <Spinner text="Verifying..." />}

                    {audioURL && !isLoading && (
                        <div className="w-full space-y-4">
                            <audio src={audioURL} controls className="w-full" />
                            <button onClick={handleLogin} className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300">
                                Verify and Login
                            </button>
                            <button onClick={startRecording} className="w-full py-2 font-semibold text-highlight rounded-lg hover:bg-accent transition duration-300">
                                Record Again
                            </button>
                        </div>
                    )}
                </div>
                
                <button onClick={onClose} disabled={isLoading} className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

export default VoiceRecorder;
