import type {
  DealRoom,
  DealRoomMessage,
  DualFeedCard,
  EscrowTransaction,
  Profile,
} from "@/types/database";

const now = Date.now();

export const mockProfiles: Record<string, Profile> = {
  bach_maya: {
    id: "bach_maya",
    user_id: "u_maya",
    role: "bachelor",
    display_name: "Maya R.",
    avatar_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop",
    bio: "Tel Aviv nights, rooftop jazz, zero dry openers.",
    roast_profile:
      "Walks into a bar like she owns the Wi-Fi password. Will roast your playlist and still ask for the aux.",
    city: "Tel Aviv",
    age: 27,
    notoriety_points: 0,
    shark_tier: null,
    vouch_quote: null,
    media_urls: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop",
    ],
    available_balance: 0,
    pending_balance: 0,
    is_verified: true,
    created_at: new Date(now - 86400000 * 40).toISOString(),
    updated_at: new Date(now - 3600000).toISOString(),
  },
  shark_noa: {
    id: "shark_noa",
    user_id: "u_noa",
    role: "shark",
    display_name: "Noa · Rizz Master",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    bio: "I lock dates in under 3 minutes. Bring your A-game.",
    roast_profile: null,
    city: "Tel Aviv",
    age: 29,
    notoriety_points: 1840,
    shark_tier: "rizz_master",
    vouch_quote:
      "Maya is chaos with perfect eyeliner. If you survive the first coffee, you're hooked.",
    media_urls: [],
    available_balance: 350,
    pending_balance: 100,
    is_verified: true,
    created_at: new Date(now - 86400000 * 120).toISOString(),
    updated_at: new Date(now - 1800000).toISOString(),
  },
  bach_eli: {
    id: "bach_eli",
    user_id: "u_eli",
    role: "bachelor",
    display_name: "Eli K.",
    avatar_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop",
    bio: "Product designer. Bad at small talk, lethal at late-night falafel runs.",
    roast_profile:
      "Looks like he knows your blood type from LinkedIn. Soft eyes, sharp takes.",
    city: "Herzliya",
    age: 31,
    notoriety_points: 0,
    shark_tier: null,
    vouch_quote: null,
    media_urls: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop",
    ],
    available_balance: 0,
    pending_balance: 0,
    is_verified: true,
    created_at: new Date(now - 86400000 * 22).toISOString(),
    updated_at: new Date(now - 7200000).toISOString(),
  },
  shark_dani: {
    id: "shark_dani",
    user_id: "u_dani",
    role: "shark",
    display_name: "Dani · Pro",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Community Shark. 47 locked dates. Zero ghost reports.",
    roast_profile: null,
    city: "Herzliya",
    age: 33,
    notoriety_points: 920,
    shark_tier: "pro_matchmaker",
    vouch_quote:
      "Eli will redesign your life pitch mid-date. Bring curiosity or get left at the counter.",
    media_urls: [],
    available_balance: 150,
    pending_balance: 50,
    is_verified: true,
    created_at: new Date(now - 86400000 * 90).toISOString(),
    updated_at: new Date(now - 900000).toISOString(),
  },
  bach_lina: {
    id: "bach_lina",
    user_id: "u_lina",
    role: "bachelor",
    display_name: "Lina S.",
    avatar_url:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1200&fit=crop",
    bio: "Surfer. Reads menus like contracts. Keen on sunrise dates.",
    roast_profile:
      "Will judge your board choice before your personality. Salt-water energy only.",
    city: "Haifa",
    age: 26,
    notoriety_points: 0,
    shark_tier: null,
    vouch_quote: null,
    media_urls: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1200&fit=crop",
    ],
    available_balance: 0,
    pending_balance: 0,
    is_verified: false,
    created_at: new Date(now - 86400000 * 12).toISOString(),
    updated_at: new Date(now - 5400000).toISOString(),
  },
  shark_omi: {
    id: "shark_omi",
    user_id: "u_omi",
    role: "shark",
    display_name: "Omi · Baby Shark",
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bio: "Friend Shark climbing the ladder. Fresh vouch streak.",
    roast_profile: null,
    city: "Haifa",
    age: 25,
    notoriety_points: 210,
    shark_tier: "baby_shark",
    vouch_quote:
      "Lina is a sunrise person who somehow thrives at 1am. Match her energy or tap out.",
    media_urls: [],
    available_balance: 0,
    pending_balance: 50,
    is_verified: true,
    created_at: new Date(now - 86400000 * 30).toISOString(),
    updated_at: new Date(now - 1200000).toISOString(),
  },
  bach_yon: {
    id: "bach_yon",
    user_id: "u_yon",
    role: "bachelor",
    display_name: "Yonatan M.",
    avatar_url:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1200&fit=crop",
    bio: "Chef. Will cook for you and still order dessert.",
    roast_profile:
      "Knife skills intimidating. Soft laugh redeeming. Asks about your favorite spice like it's a vibe check.",
    city: "Jerusalem",
    age: 34,
    notoriety_points: 0,
    shark_tier: null,
    vouch_quote: null,
    media_urls: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1200&fit=crop",
    ],
    available_balance: 0,
    pending_balance: 0,
    is_verified: true,
    created_at: new Date(now - 86400000 * 55).toISOString(),
    updated_at: new Date(now - 2400000).toISOString(),
  },
  shark_tamar: {
    id: "shark_tamar",
    user_id: "u_tamar",
    role: "shark",
    display_name: "Tamar · Master",
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    bio: "Master Matchmaker. Escrow clean. Calendar full.",
    roast_profile: null,
    city: "Jerusalem",
    age: 36,
    notoriety_points: 2410,
    shark_tier: "rizz_master",
    vouch_quote:
      "Yonatan plates romance like a tasting menu. Don't flake — he'll notice the seasoning.",
    media_urls: [],
    available_balance: 500,
    pending_balance: 50,
    is_verified: true,
    created_at: new Date(now - 86400000 * 200).toISOString(),
    updated_at: new Date(now - 600000).toISOString(),
  },
};

export const mockFeedCards: DualFeedCard[] = [
  {
    id: "card_maya",
    duo: {
      id: "duo_maya_noa",
      bachelor_id: "bach_maya",
      shark_id: "shark_noa",
      invite_status: "linked",
      linked_at: new Date(now - 86400000 * 35).toISOString(),
      created_at: new Date(now - 86400000 * 38).toISOString(),
    },
    bachelor: mockProfiles.bach_maya,
    shark: mockProfiles.shark_noa,
    interests: ["Rooftop jazz", "Late walks", "Aux wars"],
    perfect_for: "Someone who laughs first and plans second",
  },
  {
    id: "card_eli",
    duo: {
      id: "duo_eli_dani",
      bachelor_id: "bach_eli",
      shark_id: "shark_dani",
      invite_status: "linked",
      linked_at: new Date(now - 86400000 * 18).toISOString(),
      created_at: new Date(now - 86400000 * 20).toISOString(),
    },
    bachelor: mockProfiles.bach_eli,
    shark: mockProfiles.shark_dani,
    interests: ["Design", "Falafel runs", "Quiet bars"],
    perfect_for: "A curious talker who likes soft eyes, sharp takes",
  },
  {
    id: "card_lina",
    duo: {
      id: "duo_lina_omi",
      bachelor_id: "bach_lina",
      shark_id: "shark_omi",
      invite_status: "linked",
      linked_at: new Date(now - 86400000 * 8).toISOString(),
      created_at: new Date(now - 86400000 * 10).toISOString(),
    },
    bachelor: mockProfiles.bach_lina,
    shark: mockProfiles.shark_omi,
    interests: ["Sunrise surf", "Salt air", "Slow mornings"],
    perfect_for: "Someone who can match sunrise energy at 1am",
  },
  {
    id: "card_yon",
    duo: {
      id: "duo_yon_tamar",
      bachelor_id: "bach_yon",
      shark_id: "shark_tamar",
      invite_status: "linked",
      linked_at: new Date(now - 86400000 * 50).toISOString(),
      created_at: new Date(now - 86400000 * 52).toISOString(),
    },
    bachelor: mockProfiles.bach_yon,
    shark: mockProfiles.shark_tamar,
    interests: ["Home cooking", "Spice talk", "Dessert first"],
    perfect_for: "A date who treats dinner like a love language",
  },
];

/** Active deal room: started ~45s ago, 3 min window */
export const mockDealRoom: DealRoom = {
  id: "deal_001",
  match_id: "match_001",
  shark_a_id: "shark_noa",
  shark_b_id: "shark_dani",
  bachelor_a_id: "bach_maya",
  bachelor_b_id: "bach_eli",
  started_at: new Date(now - 45_000).toISOString(),
  ends_at: new Date(now - 45_000 + 180_000).toISOString(),
  status: "active",
  created_at: new Date(now - 60_000).toISOString(),
};

export const mockDealMessages: DealRoomMessage[] = [
  {
    id: "msg_1",
    deal_room_id: "deal_001",
    sender_id: "system",
    sender_role: "system",
    body: "You’re live — pick a place and time before the clock runs out.",
    created_at: new Date(now - 44_000).toISOString(),
  },
  {
    id: "msg_2",
    deal_room_id: "deal_001",
    sender_id: "shark_noa",
    sender_role: "shark",
    body: "Maya’s free Thu 20:00 — Cafe Xo, Florentin. Soft lighting, loud enough to hide awkward pauses.",
    created_at: new Date(now - 38_000).toISOString(),
  },
  {
    id: "msg_3",
    deal_room_id: "deal_001",
    sender_id: "shark_dani",
    sender_role: "shark",
    body: "Eli’s in. He wants outdoor seating. Can we hold a table for two?",
    created_at: new Date(now - 30_000).toISOString(),
  },
  {
    id: "msg_4",
    deal_room_id: "deal_001",
    sender_id: "bach_maya",
    sender_role: "earpiece",
    body: "Ask if they do oat milk. Non-negotiable.",
    created_at: new Date(now - 24_000).toISOString(),
  },
  {
    id: "msg_5",
    deal_room_id: "deal_001",
    sender_id: "shark_noa",
    sender_role: "shark",
    body: "Patio + oat milk confirmed. Ready to lock the date?",
    created_at: new Date(now - 12_000).toISOString(),
  },
];

export type UpcomingDate = {
  id: string;
  pair: string;
  venue: string;
  when: string;
  note: string;
  photo_a: string;
  photo_b: string;
};

export const mockUpcomingDates: UpcomingDate[] = [
  {
    id: "date_1",
    pair: "Maya × Eli",
    venue: "Cafe Xo, Florentin",
    when: "Thu · 20:00",
    note: "Patio table · first coffee energy",
    photo_a: mockProfiles.bach_maya.avatar_url,
    photo_b: mockProfiles.bach_eli.avatar_url,
  },
  {
    id: "date_2",
    pair: "Lina × Yonatan",
    venue: "Gordon Beach café",
    when: "Sat · 09:30",
    note: "Sunrise walk, then iced coffee",
    photo_a: mockProfiles.bach_lina.avatar_url,
    photo_b: mockProfiles.bach_yon.avatar_url,
  },
];

export const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: "esc_1",
    shark_id: "shark_noa",
    match_id: "match_old_1",
    duo_id: "duo_maya_noa",
    amount_ils: 70,
    platform_fee: 20,
    shark_payout: 50,
    status: "available",
    description: "Maya × Jordan — checked in at the date",
    created_at: new Date(now - 86400000 * 6).toISOString(),
    released_at: new Date(now - 86400000 * 5).toISOString(),
  },
  {
    id: "esc_2",
    shark_id: "shark_noa",
    match_id: "match_old_2",
    duo_id: "duo_maya_noa",
    amount_ils: 70,
    platform_fee: 20,
    shark_payout: 50,
    status: "available",
    description: "Maya × Amir — both said it went well",
    created_at: new Date(now - 86400000 * 14).toISOString(),
    released_at: new Date(now - 86400000 * 13).toISOString(),
  },
  {
    id: "esc_3",
    shark_id: "shark_noa",
    match_id: "match_001",
    duo_id: "duo_maya_noa",
    amount_ils: 70,
    platform_fee: 20,
    shark_payout: 50,
    status: "pending",
    description: "Maya × Eli — waiting for check-in",
    created_at: new Date(now - 3600000).toISOString(),
    released_at: null,
  },
  {
    id: "esc_4",
    shark_id: "shark_noa",
    match_id: "match_old_3",
    duo_id: "duo_maya_noa",
    amount_ils: 70,
    platform_fee: 20,
    shark_payout: 50,
    status: "pending",
    description: "Maya × Tom — date happening soon",
    created_at: new Date(now - 86400000 * 1).toISOString(),
    released_at: null,
  },
  {
    id: "esc_5",
    shark_id: "shark_noa",
    match_id: "match_old_4",
    duo_id: "duo_maya_noa",
    amount_ils: 70,
    platform_fee: 20,
    shark_payout: 50,
    status: "withdrawn",
    description: "Transferred out · ₪250",
    created_at: new Date(now - 86400000 * 20).toISOString(),
    released_at: new Date(now - 86400000 * 19).toISOString(),
  },
];

/** Current session viewer (Shark Noa) for earnings demo */
export const currentShark = mockProfiles.shark_noa;
