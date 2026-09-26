"use client";

import { useParams } from "next/navigation";
import { ProfileView } from "@/components/profile/profile-view";
import { people } from "@/lib/mock-data";

export default function BachelorOtherProfilePage() {
  const params = useParams<{ id: string }>();
  const person = people[params.id] ?? people.eli;
  return <ProfileView person={person} />;
}
