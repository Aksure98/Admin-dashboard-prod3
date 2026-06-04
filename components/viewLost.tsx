"use client";

import { CheckIcon, PhoneIcon, XIcon } from "@phosphor-icons/react";
import FormModal from "./modal";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useGetSingleLostItem } from "@/hooks/lostandfound/getSingleItem";
import Image from "next/image";
import { formatDate } from "@/utils/utils";
import { useClaimLostItem } from "@/hooks/lostandfound/markAsClaimed";

interface ViewLostProps {
  isOpen: boolean;
  onClose: () => void;
  ticket_id: string;
}

const ViewLost = ({ isOpen, onClose, ticket_id }: ViewLostProps) => {
  const { data: singleData } = useGetSingleLostItem(ticket_id);
  const { mutate: claimItem, isPending: isClaiming } = useClaimLostItem();
  const lostData = singleData?.data;
  console.log(singleData, "SINGLE DATA");
  const handleMrkAsClaimed = () => {
    claimItem(
      {
        ticket_id: lostData?.ticket_id ?? "",
        claim_notes: "",
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };
  if (!isOpen) return null;

  return (
    <FormModal
      title="Lost Item Details"
      saveButtonText={
        lostData?.status === "CLAIMED"
          ? undefined
          : isClaiming
            ? "Claiming..."
            : "Mark as Claimed"
      }
      saveIcon={
        lostData?.status === "CLAIMED" ? undefined : <CheckIcon size={20} />
      }
      showSaveButton={lostData?.status !== "CLAIMED"}
      onCancel={onClose}
      onSave={handleMrkAsClaimed}
      showCancelButton={true}
      cancelButtonText="Close"
      cancelIcon={<XIcon size={20} />}
      className="max-w-2xl"
      isLoading={isClaiming}
    >
      <div className="flex flex-col gap-5">
        <h2 className="text-neutral-900 text-sm  font-bold">
          Item ID: {lostData?.ticket_id}
        </h2>

        <div>
          <h3 className="text-grey-600 font-bold text-base font-figtree">
            Item Information
          </h3>

          <div className="bg-grey-50 rounded-md flex flex-col gap-3 p-4">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-3 text-grey-600 text-base font-figtree">
                <h4 className=" font-normal">Category</h4>

                <p className="font-bold">{lostData?.item_category}</p>
              </div>
              <div className="flex flex-col gap-3 text-grey-600 text-base font-figtree">
                <h4 className=" font-normal">Status</h4>

                <p
                  className={`font-bold w-fit px-2 rounded-xl capitalize ${
                    lostData?.status === "REPORTED"
                      ? "bg-warning-100 text-warning-600"
                      : lostData?.status === "CLAIMED"
                        ? "bg-success-100 text-success-600"
                        : "bg-grey-100 text-grey-600"
                  }`}
                >
                  {lostData?.status}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 text-grey-600 text-base font-figtree">
              <h4 className=" font-normal">Description</h4>

              <p className="font-bold">{lostData?.description}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-grey-600 font-bold text-base font-figtree">
            Found Information
          </h3>

          <div className="bg-grey-50 rounded-md flex flex-col gap-3 p-4">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-3 text-grey-600 text-base font-figtree">
                <h4 className=" font-normal">Location</h4>

                <p className="font-bold">{lostData?.pickup_state}</p>
              </div>
              <div className="flex flex-col gap-3 text-grey-600 text-base font-figtree">
                <h4 className=" font-normal">Trip ID</h4>

                <p className="font-bold text-brand-500">
                  {lostData?.booking_id}
                </p>
              </div>
              <div className="flex flex-col gap-3 text-grey-600 text-base font-figtree">
                <h4 className=" font-normal">Date</h4>

                <p className="font-bold">
                  {formatDate(lostData?.created_at ?? "")}
                </p>
              </div>
              {/* <div className="flex flex-col gap-3 text-grey-600 text-base font-figtree">
                <h4 className=" font-normal">Time</h4>

                <p className="font-bold ">{lostData?.itemsInfo.time}</p>
              </div> */}
              {/* <div className="flex flex-col gap-3 text-grey-600 text-base font-figtree">
                <h4 className=" font-normal">Reported By</h4>

                <p className="font-bold ">{lostData?.reportedBy?.name}</p>
              </div> */}
              {/* <div className="flex flex-col gap-3 text-grey-600 text-base font-figtree">
                <h4 className=" font-normal">Contact</h4>

                <p className="font-bold ">{lostData?.}</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* {lostData?.status === "REPORTED" && (
          <div className="border border-brand-300 bg-brand-25 rounded-xl p-4 flex flex-col gap-4">
            <h2 className="text-grey-600 font-bold text-base">Reported By</h2>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={lostData?.reportedBy?.image}
                    alt={lostData?.reportedBy?.name || ""}
                  />
                  <AvatarFallback>
                    {lostData?.reportedBy?.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{lostData?.reportedBy?.name}</h3>
                  <h3 className="">{lostData?.reportedBy?.email}</h3>
                </div>
              </div>

              <div className="bg-brand-600 text-white rounded-2xl flex items-center gap-2 cursor-pointer px-2 py-1">
                call <PhoneIcon size={20} />
              </div>
            </div>
          </div>
        )} */}

        {lostData?.status === "CLAIMED" && (
          <div>
            <h3 className="text-grey-600 font-bold text-base font-figtree">
              Claimed Information
            </h3>

            <div className="bg-grey-50 rounded-md flex flex-col gap-3 p-4">
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-5 text-grey-600 text-base font-figtree">
                  <h4 className=" font-normal">Claimed by</h4>

                  <p className="font-bold">{lostData?.claimed_by}</p>
                </div>
                {/* <div className="flex flex-col gap-5 text-grey-600 text-base font-figtree">
                  <h4 className=" font-normal">Contact</h4>

                  <p className="font-bold">{lostData?.claimInfo?.email}</p>
                </div> */}
                <div className="flex flex-col gap-5 text-grey-600 text-base font-figtree">
                  <h4 className=" font-normal">Date</h4>

                  <p className="font-bold">
                    {formatDate(lostData?.claimed_at)}
                  </p>
                </div>
                <div className="flex flex-col gap-5 text-grey-600 text-base font-figtree">
                  <h4 className=" font-normal">Claim Note</h4>

                  <p className="font-bold">
                    {lostData?.claim_notes || "No claim notes provided"}
                  </p>
                </div>
                <div className="flex flex-col gap-5 text-grey-600 text-base font-figtree">
                  <h4 className=" font-normal">Contact</h4>

                  <p className="font-bold">{lostData?.contact_value}</p>
                </div>
                {/* <div className="flex flex-col gap-5 text-grey-600 text-base font-figtree">
                  <h4 className=" font-normal">Time</h4>

                  <p className="font-bold">{lostData?.claimInfo?.claimTime}</p>
                </div> */}
              </div>
            </div>
          </div>
        )}

        {lostData?.image_urls && lostData.image_urls.length > 0 && (
          <div className="flex gap-4 mt-2">
            {lostData.image_urls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Item ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md"
                width={100}
                height={100}
              />
            ))}
          </div>
        )}
      </div>
    </FormModal>
  );
};

export default ViewLost;
