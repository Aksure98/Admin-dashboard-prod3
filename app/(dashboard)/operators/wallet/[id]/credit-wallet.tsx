"use client";

import { useState } from "react";
import { Input } from "@/components/inputs";
import { Select } from "@/components/inputs";
// import { TextArea } from "@/components/inputs";
import FormModal from "@/components/modal";
import { XIcon } from "@phosphor-icons/react";
import { useCreditDriverWallet } from "@/hooks/drivers/creditDriver";

interface CreditWalletProps {
  isOpen: boolean;
  onClose: () => void;

  driverId: string;
}

const CreditWallet = ({
  isOpen,
  onClose,

  driverId,
}: CreditWalletProps) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  // const [reference, setReference] = useState("");
  // const [notes, setNotes] = useState("");
  const creditMutation = useCreditDriverWallet();

  const handleCredit = async () => {
    if (!amount || !reason) return;

    await creditMutation.mutateAsync(
      {
        id: driverId,
        data: {
          amount,
          reason,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Credit Wallet"
      subtitle=""
      onCancel={onClose}
      onSave={handleCredit}
      saveButtonText={
        creditMutation.isPending ? "Processing..." : "Confirm Credit"
      }
      isLoading={creditMutation.isPending}
      showCancelButton={true}
      cancelButtonText="Cancel"
      cancelIcon={<XIcon size={18} />}
      className="max-w-xl h-[95vh] rounded-l-3xl"
    >
      <div className="flex flex-col gap-6">
        {/* <div className="border-2 border-blue-400 rounded-lg p-4 bg-blue-50 flex justify-between items-center">
          <span className="text-grey-700 font-medium">Current Balance</span>
          <span className="text-2xl font-bold text-grey-900">
            ₦{currentBalance?.toLocaleString() || "0"}
          </span>
        </div> */}
        <div>
          <label className="block text-sm font-bold text-grey-800 mb-2">
            Amount to Credit
          </label>
          <Input
            name="amount"
            placeholder="₦0.00"
            size="md"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-grey-800 mb-2">
            Reason
          </label>
          <Select
            name="reason"
            placeholder="Select a reason"
            options={[
              { value: "Bonus", label: "Bonus Payment" },
              { value: "Refund", label: "Refund" },
              { value: "Compensation", label: "Compensation" },
              { value: "Incentive", label: "Incentive" },
              { value: "Adjustment", label: "Adjustment" },
              { value: "other", label: "Other" },
            ]}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* <div>
          <label className="block text-sm font-bold text-grey-800 mb-2">
            Reference Number
          </label>
          <Input
            name="reference"
            placeholder="Optional reference"
            size="md"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div> */}

        {/* <div>
          <label className="block text-sm font-bold text-grey-800 mb-2">
            Notes
          </label>
          <TextArea
            name="notes"
            placeholder="Add any additional notes (internal use only)"
            size="md"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div> */}
      </div>
    </FormModal>
  );
};

export default CreditWallet;
