import { WalletView } from "@/components/wallet/wallet-view";
import { currentShark, mockEscrowTransactions } from "@/lib/mock-data";

export default function WalletPage() {
  return (
    <WalletView shark={currentShark} transactions={mockEscrowTransactions} />
  );
}
