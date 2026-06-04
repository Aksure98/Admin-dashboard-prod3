"use client";

import { useState } from "react";
import { Input } from "@/components/inputs";
import { Select } from "@/components/inputs";
import { TextArea } from "@/components/inputs";
import FormModal from "@/components/modal";
import { XIcon } from "@phosphor-icons/react";

interface DebitWalletProps {
  isOpen: boolean;
  onClose: () => void;
  operatorName: string;
  operatorId: string;
  currentBalance: number;
}

const DebitWallet = ({
  isOpen,
  onClose,
  operatorName,
  operatorId,
  currentBalance,
}: DebitWalletProps) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const handleDebit = () => {
    if (!amount || !reason) return;
    // TODO: integrate with API/backend
    console.log("Debit wallet:", { amount, reason, reference, notes });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Debit Wallet"
      subtitle={`${operatorName}: R-${operatorId}`}
      onCancel={onClose}
      onSave={handleDebit}
      saveButtonText="Confirm Debit"
      showCancelButton={true}
      cancelButtonText="Cancel"
      cancelIcon={<XIcon size={18} />}
      className="max-w-xl h-screen rounded-l-3xl"
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
            Amount to Debit
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
              { value: "commission-deduction", label: "Commission Deduction" },
              { value: "penalty", label: "Penalty" },
              { value: "paylater-settlement", label: "Pay Later Settlement" },
              { value: "chargeback", label: "Chargeback" },
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

export default DebitWallet;
