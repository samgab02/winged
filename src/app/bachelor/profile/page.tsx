"use client";

import { ProfileView } from "@/components/profile/profile-view";
import { people } from "@/lib/mock-data";
import { useSession } from "@/lib/store";

export default function BachelorProfilePage() {
  const sharkName = useSession((s) => s.linkedSharkName);
  const name = useSession((s) => s.bachelorName);
  const interests = useSession((s) => s.interests);
  const self = {
    ...people.maya,
    firstName: name || people.maya.firstName,
    interests: interests.length ? interests : people.maya.interests,
  };

  return <ProfileView person={self} sharkName={sharkName} isSelf />;
}
