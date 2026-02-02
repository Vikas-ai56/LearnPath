import React from 'react';
import QuestsPanel from './QuestsPanel';
import MinutePaper from './MinutePaper';
import JigsawStatus from './JigsawStatus';

/**
 * Dashboard Sidebar Component
 * Contains quests, minute paper, and jigsaw status
 */
const DashboardSidebar = ({ 
  quests,
  paperInput,
  setPaperInput,
  paperResponse,
  isPaperLoading,
  onPaperSubmit,
  onPaperReset
}) => {
  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      <QuestsPanel quests={quests} />
      
      <MinutePaper 
        paperInput={paperInput}
        setPaperInput={setPaperInput}
        paperResponse={paperResponse}
        isPaperLoading={isPaperLoading}
        onSubmit={onPaperSubmit}
        onReset={onPaperReset}
      />
      
      <JigsawStatus />
    </div>
  );
};

export default DashboardSidebar;
