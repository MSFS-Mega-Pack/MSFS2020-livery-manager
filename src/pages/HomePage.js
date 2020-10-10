import React, { useEffect, useState } from 'react';

import MainPage from '../components/MainPage';
import { InstalledLiveries, AvailableLiveries, Feed, Settings } from '../components/HomeTabs';
import FetchAndParseJsonManifest from '../helpers/Manifest/FetchAndParseManifest';
import Constants from '../data/Constants.json';
import ActiveApiEndpoint from '../data/ActiveApiEndpoint';

export default function LiveryManager() {
  const [openPage, setOpenPage] = useState('dashboard');

  // Feed state
  const [feed, setFeed] = useState(undefined);
  const [fullHistory, setFullHistory] = useState(null);

  // Avail liveries state
  const [fileListing, setFileListing] = useState(undefined);
  const [justRefreshed, setJustRefreshed] = useState(false);

  useEffect(() => {
    let key;

    if (justRefreshed) {
      key = setInterval(() => {
        let now = new Date().getTime();

        if (now > justRefreshed + Constants.refreshInterval) {
          setJustRefreshed(false);
          clearInterval(key);
        }
      }, 500);
    }

    return () => {
      clearInterval(key);
    };
  }, [justRefreshed, setJustRefreshed]);

  function handlePageChange(newPage) {
    setOpenPage(newPage);
  }

  const pg = openPage.toLowerCase();

  function UpdateFileList(callback) {
    FetchAndParseJsonManifest(`${ActiveApiEndpoint}/${Constants.api.get.cdnFileListing}`)
      .then(d => {
        setFileListing({ checkedAt: new Date().getTime(), ...d });
        typeof callback === 'function' && callback();
      })
      .catch(() => setFileListing(null));
  }

  if (typeof fileListing === 'undefined') {
    UpdateFileList();
  }

  return (
    <MainPage
      onTabChange={handlePageChange}
      scrollInnerStyle={
        openPage.toLowerCase() === 'dashboard'
          ? {
              WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
            }
          : openPage.toLowerCase() === 'settings'
          ? {
              paddingBottom: 100,
              WebkitMaskImage: 'linear-gradient(black calc(90% - 81px), transparent calc(100% - 81px), black calc(100% - 81px), black 100%)',
            }
          : null
      }
    >
      <div style={{ display: pg !== 'dashboard' && 'none' }}>
        <Feed feed={feed} setFeed={setFeed} fullHistory={fullHistory} setFullHistory={setFullHistory} />
      </div>
      <div style={{ display: pg !== 'available liveries' && 'none' }}>
        <AvailableLiveries
          justRefreshed={justRefreshed}
          setJustRefreshed={setJustRefreshed}
          fileListing={fileListing}
          setFileListing={setFileListing}
          UpdateFileList={UpdateFileList}
        />
      </div>
      <div style={{ display: pg !== 'installed liveries' && 'none' }}>
        <InstalledLiveries
          justRefreshed={justRefreshed}
          setJustRefreshed={setJustRefreshed}
          fileListing={fileListing}
          UpdateFileList={UpdateFileList}
        />
      </div>
      <div style={{ display: pg !== 'settings' && 'none' }}>
        <Settings />
      </div>
    </MainPage>
  );
}
