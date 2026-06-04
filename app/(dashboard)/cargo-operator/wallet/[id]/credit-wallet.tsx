"use client";

import { useState } from "react";
import { Input } from "@/components/inputs";
import { Select } from "@/components/inputs";
import { TextArea } from "@/components/inputs";
import FormModal from "@/components/modal";
import { XIcon } from "@phosphor-icons/react";

interface CreditWalletProps {
  isOpen: boolean;
  onClose: () => void;
  operatorName: string;
  operatorId: string;
  currentBalance: number;
}

const CreditWallet = ({
  isOpen,
  onClose,
  operatorName,
  operatorId,
  currentBalance,
}: CreditWalletProps) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const handleCredit = () => {
    if (!amount || !reason) return;
    // TODO: integrate with API/backend
    console.log("Credit wallet:", { amount, reason, reference, notes });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Credit Wallet"
      subtitle={`${operatorName}: R-${operatorId}`}
      onCancel={onClose}
      onSave={handleCredit}
      saveButtonText="Confirm Credit"
      showCancelButton={true}
      cancelButtonText="Cancel"
      cancelIcon={<XIcon size={18} />}
      className="max-w-xl h-[95vh] rounded-l-3xl"
    >
      <div className="flex flex-col gap-6">
        <div className="border-2 border-blue-400 rounded-lg p-4 bg-blue-50 flex justify-between items-center">
          <span className="text-grey-700 font-medium">Current Balance</span>
          <span className="text-2xl font-bold text-grey-900">
            ₦{currentBalance?.toLocaleString() || "0"}
          </span>
        </div>
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
              { value: "bonus", label: "Bonus Payment" },
              { value: "refund", label: "Refund" },
              { value: "compensation", label: "Compensation" },
              { value: "incentive", label: "Incentive" },
              { value: "adjustment", label: "Adjustment" },
              { value: "other", label: "Other" },
            ]}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div>
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
        </div>

        <div>
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
        </div>
      </div>
    </FormModal>
  );
};

export default CreditWallet;
