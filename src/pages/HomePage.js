import React, { useEffect, useState } from 'react';

import MainPage from '../components/MainPage';
import { InstalledLiveries, AvailableLiveries, Feed, Settings } from '../components/HomeTabs';
import FetchAndParseJsonManifest from '../helpers/Manifest/FetchAndParseManifest';
import Constants from '../data/Constants.json';
import ActiveApiEndpoint from '../data/ActiveApiEndpoint';
import GetInstalledAddons from '../helpers/AddonInstaller/getInstalledAddons';

export default function LiveryManager() {
  const [openPage, setOpenPage] = useState('update_feed');

  // Feed state
  const [feed, setFeed] = useState(undefined);
  const [fullHistory, setFullHistory] = useState(null);

  // Avail liveries state
  const [fileListing, setFileListing] = useState(undefined);
  const [justRefreshed, setJustRefreshed] = useState(false);

  // Installed liveries state
  const [installedLiveries, setInstalledLiveries] = useState(undefined);

  if (typeof installedLiveries === 'undefined') {
    setInstalledLiveries(null);
    GetInstalledAddons()
      .then(liveries => setInstalledLiveries(liveries))
      .catch(e => setInstalledLiveries(e));
  }

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
        openPage === 'update_feed'
          ? {
              WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
            }
          : openPage === 'settings'
          ? {
              paddingBottom: 100,
              WebkitMaskImage: 'linear-gradient(black calc(90% - 81px), transparent calc(100% - 81px), black calc(100% - 81px), black 100%)',
            }
          : null
      }
    >
      <div style={{ display: openPage !== 'update_feed' }}>
        <Feed feed={feed} setFeed={setFeed} fullHistory={fullHistory} setFullHistory={setFullHistory} />
      </div>
      <div style={{ display: openPage !== 'available_liveries' }}>
        <AvailableLiveries
          justRefreshed={justRefreshed}
          setJustRefreshed={setJustRefreshed}
          fileListing={fileListing}
          setFileListing={setFileListing}
          UpdateFileList={UpdateFileList}
          installedLiveries={installedLiveries}
          setInstalledLiveries={setInstalledLiveries}
        />
      </div>
      <div style={{ display: openPage !== 'installed_liveries' }}>
        <InstalledLiveries
          justRefreshed={justRefreshed}
          setJustRefreshed={setJustRefreshed}
          fileListing={fileListing}
          UpdateFileList={UpdateFileList}
          installedLiveries={installedLiveries}
          setInstalledLiveries={setInstalledLiveries}
        />
      </div>
      <div style={{ display: openPage !== 'settings' }}>
        <Settings />
      </div>
    </MainPage>
  );
}
