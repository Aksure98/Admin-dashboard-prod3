"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { DocumentItem } from "@/@types";
import Image from "next/image";
import { PlusIcon, XIcon } from "@phosphor-icons/react";

interface ViewOperatorDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onApprove?: () => void;
  onReject?: () => void;
}

const ViewOperatorDocument: React.FC<ViewOperatorDocumentProps> = ({
  isOpen,
  onClose,
  document,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !document) return null;

  const {
    operator_name,
    url,
    expires_at,
    verification_status,
    // @ts-expect-error legacy API shape
    document_number,
    // @ts-expect-error legacy API shape
    uploaded_at,
    // @ts-expect-error legacy API shape
    document_type,
  } = document;

  const isApproved = verification_status === "APPROVED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 ">
      <div className="relative bg-grey-0 w-full max-w-xl overflow-y-auto scrollbar-hide flex flex-col rounded-l-3xl shadow-xl h-fit">
        <div className="flex items-center justify-between px-6 py-5 border-b border-grey-200">
          <h2 className="text-grey-800 text-lg font-bold">
            {document_type ?? "Document"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-grey-100 transition-colors text-grey-500"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6 flex-1">
          <p className="text-sm text-grey-600">
            Document Number:{" "}
            <span className="font-semibold text-grey-900">
              {document_number ?? "-"}
            </span>
          </p>

          <div className="border border-grey-200 rounded-3xl bg-grey-50 px-6 py-10 flex flex-col items-center gap-3">
            {url ? (
              <div className="w-full h-48 relative rounded-xl overflow-hidden">
                <Image
                  src={url}
                  alt="Document preview"
                  fill
                  className="object-contain"
                  sizes="100%"
                />
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center">
                  <span className="text-2xl text-brand-600">^</span>
                </div>
                <p className="text-sm font-semibold text-brand-600">
                  Document Preview
                </p>
              </>
            )}
          </div>

          <div className="border-t border-grey-200 pt-6">
            <h3 className="text-base font-bold text-grey-900 mb-4">
              Tow Operator Information
            </h3>

            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-grey-500 mb-1">Name</p>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={url} alt={operator_name ?? ""} />
                    <AvatarFallback>
                      {operator_name
                        ? operator_name.charAt(0).toUpperCase()
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-grey-900">{operator_name}</p>
                </div>
              </div>
              <div>
                <p className="text-grey-500 mb-1">Document Number</p>
                <p className="font-semibold text-grey-900">
                  {document_number ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-grey-500 mb-1">Expires At</p>
                <p className="font-semibold text-grey-900">
                  {expires_at ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-grey-500 mb-1">Uploaded At</p>
                <p className="font-semibold text-grey-900">
                  {uploaded_at ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-grey-500 mb-1">Status</p>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    verification_status === "APPROVED"
                      ? "bg-success-100 text-success-600"
                      : verification_status === "REJECTED"
                        ? "bg-error-100 text-error-600"
                        : "bg-warning-50 text-warning-600"
                  }`}
                >
                  {verification_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!isApproved && (
          <div className="px-6 py-5 border-t border-grey-200 flex gap-3">
            <button
              onClick={onReject ?? onClose}
              className="flex-1 px-4 py-2.5 border border-grey-300 rounded-lg text-grey-700 text-sm font-semibold hover:bg-grey-50 transition-colors"
            >
              Reject Document
            </button>
            <button
              onClick={onApprove ?? onClose}
              className="flex-1 px-4 py-2.5 bg-brand-600 rounded-lg text-white text-sm font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon size={16} />
              Approve Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOperatorDocument;
