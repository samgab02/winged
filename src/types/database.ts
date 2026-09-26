/**
 * POVI database types — schema-ready for Supabase.
 * Mock data uses these shapes; real clients can swap in without UI changes.
 */

export type UserRole = "bachelor" | "shark";

export type SharkTier =
  | "friend_shark"
  | "baby_shark"
  | "pro_matchmaker"
  | "rizz_master";

export type DuoInviteStatus = "pending" | "linked" | "revoked";

export type MatchStatus =
  | "swiped"
  | "mutual"
  | "deal_room"
  | "date_locked"
  | "completed"
  | "expired";

export type DealRoomStatus =
  | "waiting"
  | "active"
  | "locked"
  | "expired"
  | "cancelled";

export type EscrowStatus =
  | "pending"
  | "available"
  | "withdrawn"
  | "frozen"
  | "refunded";

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  display_name: string;
  avatar_url: string;
  bio: string;
  roast_profile: string | null;
  city: string;
  age: number;
  notoriety_points: number;
  shark_tier: SharkTier | null;
  vouch_quote: string | null;
  media_urls: string[];
  available_balance: number;
  pending_balance: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Duo {
  id: string;
  bachelor_id: string;
  shark_id: string;
  invite_status: DuoInviteStatus;
  linked_at: string | null;
  created_at: string;
}

export interface Match {
  id: string;
  duo_a_id: string;
  duo_b_id: string;
  status: MatchStatus;
  swiped_by_shark_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealRoom {
  id: string;
  match_id: string;
  shark_a_id: string;
  shark_b_id: string;
  bachelor_a_id: string;
  bachelor_b_id: string;
  started_at: string;
  ends_at: string;
  status: DealRoomStatus;
  created_at: string;
}

export interface EscrowTransaction {
  id: string;
  shark_id: string;
  match_id: string;
  duo_id: string;
  amount_ils: number;
  platform_fee: number;
  shark_payout: number;
  status: EscrowStatus;
  description: string;
  created_at: string;
  released_at: string | null;
}

export interface PostDateReview {
  id: string;
  match_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  scam_flag: boolean;
  comments: string | null;
  created_at: string;
}

/** Feed card: 60% bachelor media + 40% shark vouch */
export interface DualFeedCard {
  id: string;
  duo: Duo;
  bachelor: Profile;
  shark: Profile;
}

export interface DealRoomMessage {
  id: string;
  deal_room_id: string;
  sender_id: string;
  sender_role: "shark" | "system" | "earpiece";
  body: string;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      duos: { Row: Duo; Insert: Partial<Duo>; Update: Partial<Duo> };
      matches: { Row: Match; Insert: Partial<Match>; Update: Partial<Match> };
      deal_rooms: {
        Row: DealRoom;
        Insert: Partial<DealRoom>;
        Update: Partial<DealRoom>;
      };
      escrow_transactions: {
        Row: EscrowTransaction;
        Insert: Partial<EscrowTransaction>;
        Update: Partial<EscrowTransaction>;
      };
      post_date_reviews: {
        Row: PostDateReview;
        Insert: Partial<PostDateReview>;
        Update: Partial<PostDateReview>;
      };
    };
  };
};
