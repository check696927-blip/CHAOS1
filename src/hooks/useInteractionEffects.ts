import { useState, useEffect, useCallback } from "react";
import { InteractionEffect, EffectSettings } from "@/types";

const EFFECT_DURATION = 1500; // ms
const MAX_EFFECTS = 10;

export const useInteractionEffects = () => {
  const [effects, setEffects] = useState<InteractionEffect[]>([]);
  const [settings, setSettings] = useState<EffectSettings>(() => {
    const saved = localStorage.getItem('chaos_effect_settings');
    return saved ? JSON.parse(saved) : {
      intensity: 50,
      scrollEffects: true,
      clickEffects: true,
      audioVisualization: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('chaos_effect_settings', JSON.stringify(settings));
  }, [settings]);

  const addEffect = useCallback((x: number, y: number) => {
    const effect: InteractionEffect = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      y,
      timestamp: Date.now(),
    };

    setEffects((current) => {
      const newEffects = [...current, effect];
      return newEffects.slice(-MAX_EFFECTS);
    });

    setTimeout(() => {
      setEffects((current) => current.filter((e) => e.id !== effect.id));
    }, EFFECT_DURATION);
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!settings.clickEffects) return;
    addEffect(e.clientX, e.clientY);
  }, [settings.clickEffects, addEffect]);

  const handleScroll = useCallback(() => {
    if (!settings.scrollEffects) return;
    const x = window.innerWidth * Math.random();
    const y = window.scrollY + window.innerHeight * Math.random();
    if (Math.random() > 0.95) { // Only create effect 5% of scroll events
      addEffect(x, y);
    }
  }, [settings.scrollEffects, addEffect]);

  useEffect(() => {
    if (settings.clickEffects) {
      window.addEventListener('click', handleClick);
    }
    if (settings.scrollEffects) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [settings.clickEffects, settings.scrollEffects, handleClick, handleScroll]);

  const updateSettings = (newSettings: Partial<EffectSettings>) => {
    setSettings((current) => ({ ...current, ...newSettings }));
  };

  return {
    effects,
    settings,
    updateSettings,
  };
};
