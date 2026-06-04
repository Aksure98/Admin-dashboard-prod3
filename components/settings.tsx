"use client";
import { useRef, useState } from "react";
import FormModal from "./modal";
import TabNavigation from "./tabNavigation";
import ProfileSettings from "./profilesettings";
import ChangePassword from "./changePassword";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Tabs = [
  { id: "general", label: "General" },
  { id: "password", label: "Change Password" },
];

const SettingsModal = ({ isOpen, onClose }: SettingsProps) => {
  const [selectedTab, setSelectedTab] = useState("general");
  const submitRef = useRef<() => void>(null);
  if (!isOpen) return null;

  return (
    <FormModal
      title="Profile Information"
      saveButtonText={selectedTab === "general" ? "Save" : "Update Password"}
      onCancel={onClose}
      onSave={() => submitRef.current?.()}
      saveIcon={null}
      // isLoading={addTeamMutation.isPending}
      className="max-w-lg"
    >
      <TabNavigation
        tabs={Tabs}
        onTabChange={(tabId) => {
          setSelectedTab(tabId);
        }}
      />

      {selectedTab === "general" && <ProfileSettings submitRef={submitRef} />}
      {selectedTab === "password" && <ChangePassword submitRef={submitRef} />}
    </FormModal>
  );
};
export default SettingsModal;
