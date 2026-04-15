/**
 * affirmations.js (Backend Copy)
 */

export const AFFIRMATIONS = [
  "{name}, you are worthy of all the love in the universe.",
  "You are enough, {name}. Exactly as you are, right now.",
  "{name}, your presence is a gift to everyone around you.",
  "You deserve kindness — especially from yourself, {name}.",
  "{name}, loving yourself is the greatest act of courage.",
  "Your worth is not measured by your productivity, {name}.",
  "{name}, you are a masterpiece still being painted.",
  "Every part of you is worthy of love and acceptance, {name}.",
  "{name}, you are allowed to take up space in this world.",
  "You are valuable beyond what you do for others, {name}.",
  "{name}, honor what your body needs today.",
  "Your cycle is not a weakness, {name}. It is your superpower.",
  "{name}, your body works hard for you every single day.",
  "Rest is productive, {name}. Your body needs it to thrive.",
  "{name}, you are aligned with the natural rhythm of life.",
  "You are stronger than any challenge you have ever faced, {name}.",
  "{name}, what feels heavy today is building your strength for tomorrow.",
  "You rise, {name}. You always rise.",
  "{name}, abundance is your natural state of being.",
  "You attract blessings effortlessly, {name}.",
  "You live in a world of infinite possibilities, {name}.",
  "You are calm, centred, and at peace, {name}.",
  "You trust the timing of your life completely, {name}.",
  "{name}, your nervous system is safe. You are safe.",
  "{name}, your future is brighter than you can currently imagine.",
  "You are always growing into the fullest version of yourself, {name}.",
  "{name}, vitality flows through every cell of your body.",
  "Your light is on full beam today, {name}.",
  "{name}, you are doing better than you think.",
  "Give yourself the grace you freely give to others, {name}."
];

export function getRandomAffirmation(name) {
  const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
  return AFFIRMATIONS[randomIndex].replace(/\{name\}/g, name || 'Luna User');
}
