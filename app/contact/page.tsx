"use client";
import { useEffect } from "react";

export default function SpeechDemo() {
  useEffect(() => {
    const phrase =
      "Welcome to the contact section, where you can contact some of our finest members of the community";
    const utter = new SpeechSynthesisUtterance(phrase);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, []);

  return (
    <div>
      <h1>Speech Demo</h1>
      <p>
        T
      </p>
    </div>
  );
}



