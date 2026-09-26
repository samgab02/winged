import { EarningsView } from "@/components/earnings/earnings-view";
import { currentShark, mockEscrowTransactions } from "@/lib/mock-data";

export default function EarningsPage() {
  return (
    <EarningsView shark={currentShark} transactions={mockEscrowTransactions} />
  );
}
