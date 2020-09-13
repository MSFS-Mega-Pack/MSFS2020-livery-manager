import React from 'react';
import PropTypes from 'prop-types';

import { Paper, Tabs, Tab } from '@material-ui/core';

import HomeIcon from 'mdi-react/HomeIcon';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

export default function MainPage(props) {
  const TABS = [
    {
      label: 'Dashboard',
      icon: <HomeIcon />,
      iconOnly: true,
    },
    {
      label: 'Available liveries',
      iconOnly: false,
    },
    {
      label: 'Installed liveries',
      iconOnly: false,
    },
    {
      label: 'Settings',
      iconOnly: false,
    },
  ];

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (_, newValue) => {
    setSelectedTab(newValue);
    onTabChange(TABS[newValue].label);
  };

  const { children, onTabChange, scrollInnerStyle } = props;

  return (
    <>
      <Paper>
        <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
          {TABS.map(tab => (
            <Tab key={tab.label + tab.path} icon={tab.icon} label={tab.iconOnly ? null : tab.label} aria-label={tab.label} />
          ))}
        </Tabs>
      </Paper>
      <main style={{ maxHeight: 'calc(100vh - 124px)', marginTop: 16, flex: '1', display: 'flex' }}>
        <OverlayScrollbarsComponent
          options={{ scrollbars: { visibility: 'hidden' } }}
          style={{
            flex: '1',
            maxWidth: '100%',
            padding: 16,
            paddingBottom: 0,
            ...scrollInnerStyle,
          }}
        >
          {children}
        </OverlayScrollbarsComponent>
      </main>
    </>
  );
}

MainPage.propTypes = {
  children: PropTypes.node.isRequired,
  onTabChange: PropTypes.func.isRequired,
  scrollInnerStyle: PropTypes.object,
};
