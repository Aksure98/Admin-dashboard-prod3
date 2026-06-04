import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className=" rounded-full bg-grey-50 px-2 py-1 flex justify-between w-fit  ">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
            px-6 py-3 text-center text-grey-600 rounded-full font-bold text-sm transition-all duration-200 cursor-pointer
            ${activeTab === tab.id ? "bg-white " : "bg-transparent "}
          `}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default TabNavigation;
