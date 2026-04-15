/**
 * kawaiiAvatars.js
 * 
 * 50 kawaii profile pictures using DiceBear's free avatar API.
 * Each avatar has:
 *  - id: unique key
 *  - name: display name
 *  - url: DiceBear API URL
 *  - requiredLevel: minimum pet level to unlock
 *  - category: theme label
 *  - rarity: 'common' | 'rare' | 'epic' | 'legendary'
 * 
 * DiceBear styles used (all kawaii-appropriate):
 *  - notionists        → illustrated, feminine & soft
 *  - lorelei           → cute anime-style
 *  - fun-emoji         → expressive, playful
 *  - thumbs            → chunky, adorable
 *  - big-ears-neutral  → kawaii animals
 *  - croodles-neutral  → doodle style
 *  - pixel-art         → retro cute
 */

const BASE = 'https://api.dicebear.com/7.x';

// Helper to build DiceBear URLs cleanly
const db = (style, seed, extra = '') =>
  `${BASE}/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=E0BBE4,FFD1DC,D4B5FF,B5E8FF,FFDEC2${extra}`;

export const KAWAII_AVATARS = [
  // ── LEVEL 1 — Common (always unlocked) ──────────────────────────────────────
  {
    id: 'luna-blossom',
    name: 'Luna Blossom',
    url: db('notionists', 'luna-blossom'),
    requiredLevel: 1,
    category: '🌸 Blossom',
    rarity: 'common',
  },
  {
    id: 'star-girl',
    name: 'Star Girl',
    url: db('notionists', 'star-girl'),
    requiredLevel: 1,
    category: '⭐ Stars',
    rarity: 'common',
  },
  {
    id: 'honey-bear',
    name: 'Honey Bear',
    url: db('big-ears-neutral', 'honey-bear'),
    requiredLevel: 1,
    category: '🐻 Bears',
    rarity: 'common',
  },
  {
    id: 'cotton-cloud',
    name: 'Cotton Cloud',
    url: db('lorelei', 'cotton-cloud'),
    requiredLevel: 1,
    category: '☁️ Dreamy',
    rarity: 'common',
  },
  {
    id: 'peach-bunny',
    name: 'Peach Bunny',
    url: db('big-ears-neutral', 'peach-bunny'),
    requiredLevel: 1,
    category: '🐰 Bunnies',
    rarity: 'common',
  },
  {
    id: 'doodle-luna',
    name: 'Doodle Luna',
    url: db('croodles-neutral', 'doodle-luna'),
    requiredLevel: 1,
    category: '✏️ Doodle',
    rarity: 'common',
  },
  {
    id: 'happy-emoji',
    name: 'Happy Glow',
    url: db('fun-emoji', 'happy-glow'),
    requiredLevel: 1,
    category: '😊 Emoji',
    rarity: 'common',
  },
  {
    id: 'pixel-dawn',
    name: 'Pixel Dawn',
    url: db('pixel-art', 'pixel-dawn'),
    requiredLevel: 1,
    category: '🎮 Pixel',
    rarity: 'common',
  },
  {
    id: 'rose-bud',
    name: 'Rose Bud',
    url: db('notionists', 'rose-bud'),
    requiredLevel: 1,
    category: '🌹 Roses',
    rarity: 'common',
  },
  {
    id: 'thumbs-lilac',
    name: 'Lilac Dreamer',
    url: db('thumbs', 'lilac-dreamer'),
    requiredLevel: 1,
    category: '💜 Lilac',
    rarity: 'common',
  },

  // ── LEVEL 2 — Common ────────────────────────────────────────────────────────
  {
    id: 'cozy-sweater',
    name: 'Cozy Sweater',
    url: db('lorelei', 'cozy-sweater'),
    requiredLevel: 2,
    category: '🧸 Cozy',
    rarity: 'common',
  },
  {
    id: 'cherry-pop',
    name: 'Cherry Pop',
    url: db('fun-emoji', 'cherry-pop'),
    requiredLevel: 2,
    category: '🍒 Fruits',
    rarity: 'common',
  },
  {
    id: 'panda-dream',
    name: 'Panda Dream',
    url: db('big-ears-neutral', 'panda-dream'),
    requiredLevel: 2,
    category: '🐼 Pandas',
    rarity: 'common',
  },
  {
    id: 'moonlit-sky',
    name: 'Moonlit Sky',
    url: db('notionists', 'moonlit-sky'),
    requiredLevel: 2,
    category: '🌙 Moon',
    rarity: 'common',
  },
  {
    id: 'pixel-cat',
    name: 'Pixel Cat',
    url: db('pixel-art', 'pixel-cat'),
    requiredLevel: 2,
    category: '🎮 Pixel',
    rarity: 'common',
  },

  // ── LEVEL 3 — Rare ──────────────────────────────────────────────────────────
  {
    id: 'sakura-spirit',
    name: 'Sakura Spirit',
    url: db('notionists', 'sakura-spirit', '&flip=true'),
    requiredLevel: 3,
    category: '🌸 Blossom',
    rarity: 'rare',
  },
  {
    id: 'fox-maiden',
    name: 'Fox Maiden',
    url: db('big-ears-neutral', 'fox-maiden'),
    requiredLevel: 3,
    category: '🦊 Fox',
    rarity: 'rare',
  },
  {
    id: 'aurora-glow',
    name: 'Aurora Glow',
    url: db('lorelei', 'aurora-glow'),
    requiredLevel: 3,
    category: '✨ Aurora',
    rarity: 'rare',
  },
  {
    id: 'strawberry-dreams',
    name: 'Strawberry Dreams',
    url: db('fun-emoji', 'strawberry-dreams'),
    requiredLevel: 3,
    category: '🍓 Fruits',
    rarity: 'rare',
  },
  {
    id: 'doodle-star',
    name: 'Doodle Star',
    url: db('croodles-neutral', 'doodle-star'),
    requiredLevel: 3,
    category: '✏️ Doodle',
    rarity: 'rare',
  },
  {
    id: 'pixel-witch',
    name: 'Pixel Witch',
    url: db('pixel-art', 'pixel-witch'),
    requiredLevel: 3,
    category: '🎮 Pixel',
    rarity: 'rare',
  },
  {
    id: 'boba-queen',
    name: 'Boba Queen',
    url: db('notionists', 'boba-queen'),
    requiredLevel: 3,
    category: '🧋 Boba',
    rarity: 'rare',
  },
  {
    id: 'lavender-bear',
    name: 'Lavender Bear',
    url: db('big-ears-neutral', 'lavender-bear'),
    requiredLevel: 3,
    category: '🐻 Bears',
    rarity: 'rare',
  },

  // ── LEVEL 4 — Rare ──────────────────────────────────────────────────────────
  {
    id: 'cyber-bunny',
    name: 'Cyber Bunny',
    url: db('lorelei', 'cyber-bunny'),
    requiredLevel: 4,
    category: '🐰 Bunnies',
    rarity: 'rare',
  },
  {
    id: 'plum-blossom',
    name: 'Plum Blossom',
    url: db('notionists', 'plum-blossom'),
    requiredLevel: 4,
    category: '🌸 Blossom',
    rarity: 'rare',
  },
  {
    id: 'moon-rabbit',
    name: 'Moon Rabbit',
    url: db('big-ears-neutral', 'moon-rabbit'),
    requiredLevel: 4,
    category: '🌙 Moon',
    rarity: 'rare',
  },
  {
    id: 'pixel-mermaid',
    name: 'Pixel Mermaid',
    url: db('pixel-art', 'pixel-mermaid'),
    requiredLevel: 4,
    category: '🎮 Pixel',
    rarity: 'rare',
  },
  {
    id: 'thunder-cloud',
    name: 'Thunder Cloud',
    url: db('fun-emoji', 'thunder-cloud'),
    requiredLevel: 4,
    category: '⛈️ Stormy',
    rarity: 'rare',
  },

  // ── LEVEL 5 — Epic ──────────────────────────────────────────────────────────
  {
    id: 'crystal-fox',
    name: 'Crystal Fox',
    url: db('big-ears-neutral', 'crystal-fox'),
    requiredLevel: 5,
    category: '🦊 Fox',
    rarity: 'epic',
  },
  {
    id: 'neon-bloom',
    name: 'Neon Bloom',
    url: db('lorelei', 'neon-bloom'),
    requiredLevel: 5,
    category: '🌷 Bloom',
    rarity: 'epic',
  },
  {
    id: 'stardust-cat',
    name: 'Stardust Cat',
    url: db('notionists', 'stardust-cat'),
    requiredLevel: 5,
    category: '🐱 Cats',
    rarity: 'epic',
  },
  {
    id: 'galactic-panda',
    name: 'Galactic Panda',
    url: db('big-ears-neutral', 'galactic-panda'),
    requiredLevel: 5,
    category: '🐼 Pandas',
    rarity: 'epic',
  },
  {
    id: 'solar-bunny',
    name: 'Solar Bunny',
    url: db('croodles-neutral', 'solar-bunny'),
    requiredLevel: 5,
    category: '🐰 Bunnies',
    rarity: 'epic',
  },
  {
    id: 'pixel-dragon',
    name: 'Pixel Dragon',
    url: db('pixel-art', 'pixel-dragon'),
    requiredLevel: 5,
    category: '🐉 Dragon',
    rarity: 'epic',
  },

  // ── LEVEL 6 — Epic ──────────────────────────────────────────────────────────
  {
    id: 'velvet-rose',
    name: 'Velvet Rose',
    url: db('notionists', 'velvet-rose'),
    requiredLevel: 6,
    category: '🌹 Roses',
    rarity: 'epic',
  },
  {
    id: 'nebula-spirit',
    name: 'Nebula Spirit',
    url: db('lorelei', 'nebula-spirit'),
    requiredLevel: 6,
    category: '🌌 Cosmos',
    rarity: 'epic',
  },
  {
    id: 'thunder-wolf',
    name: 'Thunder Wolf',
    url: db('big-ears-neutral', 'thunder-wolf'),
    requiredLevel: 6,
    category: '🐺 Wolf',
    rarity: 'epic',
  },
  {
    id: 'pixel-angel',
    name: 'Pixel Angel',
    url: db('pixel-art', 'pixel-angel'),
    requiredLevel: 6,
    category: '🎮 Pixel',
    rarity: 'epic',
  },
  {
    id: 'prism-cat',
    name: 'Prism Cat',
    url: db('notionists', 'prism-cat'),
    requiredLevel: 6,
    category: '🐱 Cats',
    rarity: 'epic',
  },

  // ── LEVEL 7–10 — Legendary ──────────────────────────────────────────────────
  {
    id: 'celestial-kitsune',
    name: 'Celestial Kitsune',
    url: db('big-ears-neutral', 'celestial-kitsune'),
    requiredLevel: 7,
    category: '🦊 Kitsune',
    rarity: 'legendary',
  },
  {
    id: 'aurora-empress',
    name: 'Aurora Empress',
    url: db('notionists', 'aurora-empress'),
    requiredLevel: 7,
    category: '👑 Royalty',
    rarity: 'legendary',
  },
  {
    id: 'moon-goddess',
    name: 'Moon Goddess',
    url: db('lorelei', 'moon-goddess'),
    requiredLevel: 8,
    category: '🌙 Goddess',
    rarity: 'legendary',
  },
  {
    id: 'pixel-queen',
    name: 'Pixel Queen',
    url: db('pixel-art', 'pixel-queen'),
    requiredLevel: 8,
    category: '👑 Royalty',
    rarity: 'legendary',
  },
  {
    id: 'sakura-dragon',
    name: 'Sakura Dragon',
    url: db('big-ears-neutral', 'sakura-dragon'),
    requiredLevel: 9,
    category: '🐉 Dragon',
    rarity: 'legendary',
  },
  {
    id: 'nova-celestia',
    name: 'Nova Celestia',
    url: db('notionists', 'nova-celestia'),
    requiredLevel: 9,
    category: '🌌 Cosmos',
    rarity: 'legendary',
  },
  {
    id: 'eternal-luna',
    name: 'Eternal Luna',
    url: db('lorelei', 'eternal-luna'),
    requiredLevel: 10,
    category: '✨ Eternal',
    rarity: 'legendary',
  },
  {
    id: 'divine-blossom',
    name: 'Divine Blossom',
    url: db('notionists', 'divine-blossom'),
    requiredLevel: 10,
    category: '🌸 Divine',
    rarity: 'legendary',
  },
];

/** Rarity config — colors, labels, badges */
export const RARITY = {
  common:    { label: 'Common',    color: '#7A593E', bg: '#FFF3E0', border: '#FFDEC2', glow: 'none' },
  rare:      { label: 'Rare',      color: '#5B7FA6', bg: '#E8F4FD', border: '#B5D8F7', glow: '0 0 12px rgba(91,127,166,0.4)' },
  epic:      { label: 'Epic',      color: '#7B5EA7', bg: '#F3EAFF', border: '#D4B5FF', glow: '0 0 16px rgba(123,94,167,0.5)' },
  legendary: { label: 'Legendary', color: '#C27A2A', bg: '#FFF8E7', border: '#FFD700', glow: '0 0 20px rgba(255,215,0,0.6)' },
};

/** Return the avatar URL for a given id (or fallback to DiceBear notionists default) */
export function getAvatarUrl(avatarId, name = 'User') {
  const found = KAWAII_AVATARS.find(a => a.id === avatarId);
  if (found) return found.url;
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=E0BBE4`;
}
