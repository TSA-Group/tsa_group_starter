"use client"
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
        This page will speak a welcome message when it loads using the Web Speech
        API.
      </p>
    </div>
  );
}



