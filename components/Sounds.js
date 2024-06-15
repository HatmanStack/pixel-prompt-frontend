import React, { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const click = require('../assets/click.wav');
const swoosh = require('../assets/swoosh.mp3');
const switchSound = require('../assets/switch.wav');
const expand = require('../assets/expand.wav');

const SoundPlayer = ({ makeSound}) => {
  const soundRef = useRef();

  useEffect(() => {
    return () => {
      // Unload the sound when the component unmounts
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (makeSound) {
      let soundFile;
      switch (makeSound[0]) {
        case 'click':
          soundFile = click;
          break;
        case 'swoosh':
          soundFile = swoosh;
          break;
        case 'switch':
          soundFile = switchSound;
          break;
        case 'expand':
          soundFile = expand;
          break;
        default:
          return;
      }
    
      // Unload the previous sound if it's still loaded
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }

      const loadAndPlaySound = async () => {
        const { sound } = await Audio.Sound.createAsync(soundFile);
        soundRef.current = sound;
        await soundRef.current.playAsync();
      };

      loadAndPlaySound().catch((error) => {
        console.log('Failed to load and play the sound', error);
      });
    }
  }, [makeSound]);

  return null;
};

export default SoundPlayer;