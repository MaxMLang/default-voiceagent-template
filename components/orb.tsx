"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useVapi from "@/hooks/use-vapi";

const RadialCard: React.FC = () => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();
  const [bars, setBars] = useState(Array(50).fill(0));
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [userVolume, setUserVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);

  // Handle radial update
  const updateBars = (volume: number) => {
    setBars(bars.map(() => Math.random() * volume * 50));
  };

  const resetBars = () => {
    setBars(Array(50).fill(0));
  };

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
              requestAnimationFrame(checkAudio);
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

  // Update visualization based on volume
  useEffect(() => {
    if (isSessionActive) {
      // Use user's microphone volume for visualization when user is speaking
      if (isUserSpeaking && userVolume > 0) {
        updateBars(userVolume * 2); // Amplify for better visualization
      } else {
        // Otherwise use the volume from Vapi (assistant speaking)
        updateBars(volumeLevel);
      }
    } else {
      resetBars();
      setIsUserSpeaking(false);
    }
  }, [volumeLevel, userVolume, isUserSpeaking, isSessionActive]);

  // Automatically stop "Connecting..." when session starts
  useEffect(() => {
    if (isSessionActive) {
      setIsConnecting(false); // Stop connecting state when session is active
    }
  }, [isSessionActive]);

  // Handle Button Click
  const handleButtonClick = () => {
    if (!isSessionActive) {
      setIsConnecting(true); // Show "Connecting..." only when starting a session
    }
    toggleCall(); // Toggle session state
  };

  return (
    <div className="border text-center justify-items-center p-4 rounded-2xl">
      <div className="flex items-center justify-center h-full relative" style={{ width: "400px", height: "400px" }}>
        {/* Button with Connecting State */}
        <button
          className={`text-white px-6 py-3 border rounded-md transition-colors flex items-center justify-center ${
            isUserSpeaking 
              ? "bg-blue-500 hover:bg-blue-600" 
              : isSessionActive 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-green-500 hover:bg-green-600"
          } ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleButtonClick}
          disabled={isConnecting}
          style={{ cursor: isConnecting ? "wait" : "pointer", zIndex: 10 }}
        >
          {isConnecting ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
              Connecting...
            </>
          ) : isUserSpeaking ? (
            "Assistant"
          ) : isSessionActive ? (
            "End Conversation"
          ) : (
            "Start Conversation"
          )}
        </button>

        {/* Larger radial animation */}
        <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ position: "absolute", top: 0, left: 0 }}>
          {bars.map((height, index) => {
            const angle = (index / bars.length) * 360;
            const radians = (angle * Math.PI) / 180;
            const x1 = 200 + Math.cos(radians) * 120;
            const y1 = 200 + Math.sin(radians) * 120;
            const x2 = 200 + Math.cos(radians) * (160 + height);
            const y2 = 200 + Math.sin(radians) * (160 + height);

            return (
              <motion.line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={`stroke-current ${
                  isUserSpeaking 
                    ? "text-blue-500 dark:text-blue-400 opacity-80" 
                    : "text-black dark:text-white dark:opacity-70 opacity-70"
                }`}
                strokeWidth={isUserSpeaking ? "3" : "2"}
                initial={{ x2: x1, y2: y1 }}
                animate={{ x2, y2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            );
          })}
        </svg>

        {/* Radial glow - changes color when user is speaking */}
        <span 
          className={`absolute top-48 w-[calc(100%-30%)] h-[calc(100%-30%)] blur-[180px] ${
            isUserSpeaking ? "bg-blue-500" : "bg-primary"
          }`}
        ></span>
        
        {/* User speaking indicator */}
        {isSessionActive && isUserSpeaking && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-4 text-blue-500 font-medium"
            >
              Assistant is listening
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default RadialCard;
