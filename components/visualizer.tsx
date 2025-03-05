"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicIcon, PhoneIcon, PhoneOff } from 'lucide-react';
import useVapi from '@/hooks/use-vapi';

const Visualizer: React.FC = () => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();
  const [bars, setBars] = useState(Array(50).fill(5));
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userVolume, setUserVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Initialize microphone input detection
  useEffect(() => {
    if (isSessionActive && !audioContextRef.current) {
      const initMicrophone = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          microphoneStreamRef.current = stream;
          
          const audioContext = new AudioContext();
          audioContextRef.current = audioContext;
          
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
          
          const microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          
          const checkAudio = () => {
            if (!isSessionActive) return;
            
            analyser.getByteFrequencyData(dataArray);
            
            // Calculate average volume
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalizedVolume = avg / 255; // Normalize to 0-1 range
            
            setUserVolume(normalizedVolume);
            setIsUserSpeaking(normalizedVolume > 0.05);
            
            if (isSessionActive) {
              animationFrameRef.current = requestAnimationFrame(checkAudio);
            }
          };
          
          checkAudio();
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      };
      
      initMicrophone();
    }
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
        microphoneStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    };
  }, [isSessionActive]);
  
  // Update visualization based on volume - with slower animation
  useEffect(() => {
    let animationTimeout: NodeJS.Timeout | null = null;
    
    const updateVisualization = () => {
      if (isSessionActive) {
        // Use user's microphone volume for visualization when user is speaking
        if (isUserSpeaking && userVolume > 0) {
          updateBars(userVolume * 2.5); // Reduced amplification for less dramatic effect
        } else {
          // Otherwise use the volume from Vapi (assistant speaking)
          updateBars(volumeLevel * 0.8); // Reduced amplification
        }
      } else {
        resetBars();
        setIsUserSpeaking(false);
      }
      
      // Slower animation rate - update every 150ms instead of every frame
      animationTimeout = setTimeout(updateVisualization, 150);
    };
    
    updateVisualization();
    
    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, [volumeLevel, userVolume, isUserSpeaking, isSessionActive]);
  
  // Automatically stop "Connecting..." when session starts
  useEffect(() => {
    if (isSessionActive) {
      setIsConnecting(false);
    }
  }, [isSessionActive]);
 
  const updateBars = (volume: number) => {
    // Smoother transitions with less randomness
    setBars(prevBars => 
      prevBars.map((prevHeight, i) => {
        const targetHeight = Math.random() * volume * 120;
        // Smooth transition - move 30% toward the target
        return prevHeight + (targetHeight - prevHeight) * 0.3;
      })
    );
  };
 
  const resetBars = () => {
    setBars(Array(50).fill(5));
  };
  
  const handleToggleCall = () => {
    if (!isSessionActive) {
      setIsConnecting(true);
    }
    toggleCall();
  };
 
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded">
      <AnimatePresence>
        {isSessionActive && (
          <motion.div
            className="flex items-center justify-center w-full h-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
              {bars.map((height, index) => (
                <React.Fragment key={index}>
                  <rect
                    x={500 + index * 20 - 490}
                    y={100 - height / 2}
                    width="10"
                    height={height}
                    className={`fill-current ${
                      isUserSpeaking 
                        ? 'text-blue-500 dark:text-blue-400 opacity-80' 
                        : isSessionActive 
                          ? 'text-black dark:text-white opacity-70' 
                          : 'text-gray-400 opacity-30'
                    }`}
                  />
                  <rect
                    x={500 - index * 20 - 10}
                    y={100 - height / 2}
                    width="10"
                    height={height}
                    className={`fill-current ${
                      isUserSpeaking 
                        ? 'text-blue-500 dark:text-blue-400 opacity-80' 
                        : isSessionActive 
                          ? 'text-black dark:text-white opacity-70' 
                          : 'text-gray-400 opacity-30'
                    }`}
                  />
                </React.Fragment>
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fixed height container to prevent jumping */}
      <div className="h-20 flex flex-col items-center justify-center">
        {/* Button container with fixed dimensions */}
        <div className="w-12 h-12 relative">
          <button 
            onClick={handleToggleCall} 
            className={`absolute inset-0 flex items-center justify-center rounded-full shadow-lg ${
              isUserSpeaking 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : isConnecting
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : isSessionActive
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : isSessionActive ? (
              <PhoneIcon size={24} />
            ) : (
              <MicIcon size={24} />
            )}
          </button>
        </div>
        
        {/* Status indicator - fixed height to prevent jumping */}
        <div className="h-6 mt-2 text-sm font-medium text-center">
          {isConnecting ? (
            <span className="text-yellow-500">Connecting...</span>
          ) : isSessionActive && isUserSpeaking ? (
            <span className="text-blue-500"> Assistant is listening</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
 
export default Visualizer;