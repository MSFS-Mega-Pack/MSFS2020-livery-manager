import React, { useState } from 'react';

import MainPage from '../components/MainPage';
import { InstalledLiveries, AvailableLiveries, Feed, Settings } from '../components/HomeTabs';

export default function LiveryManager() {
  const [openPage, setOpenPage] = useState('dashboard');

  // Feed state
  const [feed, setFeed] = useState(undefined);
  const [fullHistory, setFullHistory] = useState(null);

  // Avail liveries state
  const [fileListing, setFileListing] = useState(undefined);

  function handlePageChange(newPage) {
    setOpenPage(newPage);
  }

  const pg = openPage.toLowerCase();

  return (
    <MainPage
      onTabChange={handlePageChange}
      scrollInnerStyle={
        openPage.toLowerCase() === 'dashboard'
          ? {
              WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
            }
          : null
      }
    >
      <div style={{ display: pg !== 'dashboard' && 'none' }}>
        <Feed feed={feed} setFeed={setFeed} fullHistory={fullHistory} setFullHistory={setFullHistory} />
      </div>
      <div style={{ display: pg !== 'available liveries' && 'none' }}>
        <AvailableLiveries fileListing={fileListing} setFileListing={setFileListing} />
      </div>
      <div style={{ display: pg !== 'installed liveries' && 'none' }}>
        <InstalledLiveries />
      </div>
      <div style={{ display: pg !== 'settings' && 'none' }}>
        <Settings />
      </div>
    </MainPage>
  );
}
