
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, MessageSquare, X, Activity, Sparkles } from 'lucide-react';

const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = audioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
               const text = message.serverContent.outputTranscription.text;
               setTranscription(prev => [...prev.slice(-4), `Assistant: ${text}`]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Live API Error:', e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are the OmniSend Pro Campaign Assistant. Help users brainstorm email strategies, write subject lines, and optimize their SMTP setup. Be professional, creative, and concise.',
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Failed to start Live session:', error);
      setIsConnecting(false);
      setIsActive(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      // sessionRef.current.close(); // Implicitly closed by stopping media
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsActive(false);
    setTranscription([]);
  };

  const toggleAssistant = () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-indigo-400 opacity-0 group-hover:opacity-20 animate-pulse"></div>
        <Sparkles className="relative" size={28} />
      </button>

      {/* Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-600 text-white rounded-xl">
                      <MessageSquare size={20} />
                   </div>
                   <div>
                      <h2 className="text-lg font-bold text-slate-900">Campaign Assistant</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gemini Live Powered</p>
                   </div>
                </div>
                <button onClick={() => { stopSession(); setIsOpen(false); }} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                   <X size={20} />
                </button>
             </div>

             <div className="p-8 space-y-8 min-h-[300px] flex flex-col justify-center items-center">
                {isActive ? (
                   <div className="w-full space-y-8 flex flex-col items-center">
                      <div className="flex gap-1 items-center h-12">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                          <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                      </div>
                      
                      <div className="w-full bg-slate-50 p-4 rounded-2xl min-h-[100px] text-sm text-slate-600 italic text-center">
                         {transcription.length > 0 ? (
                           transcription.map((t, idx) => <p key={idx} className="mb-1">{t}</p>)
                         ) : (
                           "Listening for your strategy questions..."
                         )}
                      </div>
                   </div>
                ) : (
                   <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto">
                        <Mic size={40} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Talk to OmniSend Pro</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                          Ask me to draft email copy, brainstorm subject lines, or check your sending health.
                        </p>
                      </div>
                   </div>
                )}

                <button 
                  onClick={toggleAssistant}
                  disabled={isConnecting}
                  className={`w-full py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
                    isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-rose-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                  }`}
                >
                  {isConnecting ? (
                    <Activity className="animate-spin" />
                  ) : isActive ? (
                    <><MicOff size={24} /> Stop Conversation</>
                  ) : (
                    <><Mic size={24} /> Start Voice Session</>
                  )}
                </button>
             </div>

             <div className="p-4 bg-slate-50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Requires Microphone Access • Encrypted Voice Feed
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveAssistant;
