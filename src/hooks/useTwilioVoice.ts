import { useState, useEffect, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';

export type CallStatus = 'idle' | 'connecting' | 'ringing' | 'in-call' | 'disconnected' | 'error';

export function useTwilioVoice() {
  const [device, setDevice] = useState<Device | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const activeCallRef = useRef<Call | null>(null);

  useEffect(() => {
    let mounted = true;

    async function setupDevice() {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase configuration missing');
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/twilio-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identity: `user_${Date.now()}` }),
        });

        if (!response.ok) {
          throw new Error('Failed to get access token');
        }

        const data = await response.json();

        if (!mounted) return;

        const newDevice = new Device(data.token, {
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
          enableRingingState: true,
        });

        newDevice.on('registered', () => {
          console.log('Twilio Device registered');
        });

        newDevice.on('error', (error) => {
          console.error('Twilio Device error:', error);
          setError(error.message);
          setCallStatus('error');
        });

        await newDevice.register();

        if (mounted) {
          setDevice(newDevice);
        }
      } catch (err) {
        console.error('Setup error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to setup device');
          setCallStatus('error');
        }
      }
    }

    setupDevice();

    return () => {
      mounted = false;
      if (device) {
        device.destroy();
      }
    };
  }, []);

  const makeCall = async (phoneNumber: string) => {
    if (!device) {
      setError('Device not ready');
      return;
    }

    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    try {
      setCallStatus('connecting');
      setError(null);

      const call = await device.connect({
        params: {
          To: phoneNumber,
        },
      });

      activeCallRef.current = call;

      call.on('accept', () => {
        console.log('Call accepted');
        setCallStatus('in-call');
      });

      call.on('disconnect', () => {
        console.log('Call disconnected');
        setCallStatus('disconnected');
        activeCallRef.current = null;
        setTimeout(() => setCallStatus('idle'), 2000);
      });

      call.on('cancel', () => {
        console.log('Call cancelled');
        setCallStatus('idle');
        activeCallRef.current = null;
      });

      call.on('reject', () => {
        console.log('Call rejected');
        setCallStatus('idle');
        activeCallRef.current = null;
      });

      call.on('error', (error) => {
        console.error('Call error:', error);
        setError(error.message);
        setCallStatus('error');
        activeCallRef.current = null;
        setTimeout(() => setCallStatus('idle'), 3000);
      });

    } catch (err) {
      console.error('Make call error:', err);
      setError(err instanceof Error ? err.message : 'Failed to make call');
      setCallStatus('error');
      setTimeout(() => setCallStatus('idle'), 3000);
    }
  };

  const hangUp = () => {
    if (activeCallRef.current) {
      activeCallRef.current.disconnect();
      activeCallRef.current = null;
      setCallStatus('disconnected');
      setTimeout(() => setCallStatus('idle'), 2000);
    }
  };

  return {
    device,
    callStatus,
    error,
    makeCall,
    hangUp,
  };
}
