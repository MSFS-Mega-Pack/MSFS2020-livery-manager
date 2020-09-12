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

  let Page = <></>;

  switch (openPage.toLowerCase()) {
    case 'available liveries':
      Page = <AvailableLiveries fileListing={fileListing} setFileListing={setFileListing} />;
      break;

    case 'installed liveries':
      Page = <InstalledLiveries />;
      break;

    case 'settings':
      Page = <Settings />;
      break;

    case 'dashboard':
    default:
      Page = <Feed feed={feed} setFeed={setFeed} fullHistory={fullHistory} setFullHistory={setFullHistory} />;
      break;
  }

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
      {Page}
    </MainPage>
  );
}
