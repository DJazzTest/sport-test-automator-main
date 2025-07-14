import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CreateTest } from "@/components/tests/CreateTest";
import { PlaywrightTestEditor } from "@/components/tests/PlaywrightTestEditor";

const Index = () => {
  const [activeTab, setActiveTab] = useState("create-test");
  const [showTestEditor, setShowTestEditor] = useState(false);

  const renderContent = () => {
    return showTestEditor ? 
      <PlaywrightTestEditor onBack={() => setShowTestEditor(false)} /> :
      <CreateTest onCreateNew={() => setShowTestEditor(true)} />;
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default Index;
