import {
  CalendarHeart,
  CircleUserRound,
  Compass,
  Feather,
  HeartHandshake,
  Layers3,
  MessageCircleHeart,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type AppNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Extra path prefixes that count as active */
  match?: string[];
};

export const BACHELOR_NAV: AppNavItem[] = [
  { href: "/bachelor/discover", label: "Discover", icon: Compass },
  { href: "/bachelor/matches", label: "Matches", icon: HeartHandshake },
  { href: "/bachelor/dates", label: "Dates", icon: CalendarHeart },
  { href: "/bachelor/my-wing", label: "My Wing", icon: Feather },
  { href: "/bachelor/profile", label: "Profile", icon: UserRound },
];

export const WING_NAV: AppNavItem[] = [
  { href: "/wing/swipe", label: "Swipe", icon: Layers3 },
  { href: "/wing/deal-room", label: "Deal Room", icon: MessageCircleHeart },
  {
    href: "/wing/hub",
    label: "Wings",
    icon: Feather,
    match: ["/wing/hub", "/wing/network", "/wing/singles"],
  },
  { href: "/wing/me", label: "Me", icon: CircleUserRound, match: ["/wing/me"] },
];

export function navItemActive(pathname: string, item: AppNavItem) {
  if (item.match?.length) {
    return item.match.some((p) => pathname.startsWith(p));
  }
  return pathname.startsWith(item.href);
}
