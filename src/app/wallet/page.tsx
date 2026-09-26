import { redirect } from "next/navigation";

/** Wallet moved to discreet Shark Earnings */
export default function WalletRedirectPage() {
  redirect("/earnings");
}
