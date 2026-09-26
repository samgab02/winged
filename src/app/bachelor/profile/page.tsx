"use client";

import { ProfileView } from "@/components/profile/profile-view";
import { ageFromBirthday } from "@/lib/seed-catalog";
import { useApp } from "@/lib/store";

export default function BachelorProfilePage() {
  const profile = useApp((s) => s.profile);
  if (!profile) return null;

  const person = {
    id: profile.accountId,
    firstName: profile.displayName || "You",
    age: profile.birthday ? ageFromBirthday(profile.birthday) : 0,
    city: profile.city,
    bio: profile.bio,
    vibe: profile.vibeLine || profile.prompts[0]?.answer || "",
    interests: profile.interests,
    photos: profile.photos,
    avatar: profile.photos[0] || "",
  };

  return (
    <ProfileView
      person={person}
      wingName={profile.linkedWingName}
      isSelf
      prompts={profile.prompts}
    />
  );
}
