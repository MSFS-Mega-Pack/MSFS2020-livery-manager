import React, { useState } from 'react';

import MainPage from '../components/MainPage';
import { InstalledLiveries, AvailableLiveries, Feed, Settings } from '../components/HomeTabs';

export default function LiveryManager() {
  const [openPage, setOpenPage] = useState('dashboard');

  function handlePageChange(newPage) {
    setOpenPage(newPage);
  }

  let Page = <></>;

  switch (openPage.toLowerCase()) {
    case 'available liveries':
      Page = AvailableLiveries;
      break;

    case 'installed liveries':
      Page = InstalledLiveries;
      break;

    case 'settings':
      Page = Settings;
      break;

    case 'dashboard':
    default:
      Page = Feed;
      break;
  }

  return (
    <MainPage onTabChange={handlePageChange}>
      <Page />
    </MainPage>
  );
}
