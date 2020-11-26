import React from 'react';
import PropTypes from 'prop-types';

import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import HomeIcon from 'mdi-react/HomeIcon';

import OfflineError from './OfflineError';
import LocaleContext from '../locales/LocaleContext';

const useStyles = makeStyles({
  main: {
    maxHeight: 'calc(100vh - 124px)',
    marginTop: 16,
    flex: '1',
    display: 'flex',
  },
  scrollbarComponent: {
    flex: '1',
    maxWidth: '100%',
    padding: 16,
    paddingBottom: 0,
  },
});

export default function MainPage(props) {
  const { children, onTabChange, scrollInnerStyle } = props;

  const CurrentLocal = React.useContext(LocaleContext);

  const TABS = [
    {
      id: 'update_feed',
      label: CurrentLocal.translate('manager.tabs.tab_labels.update_feed'),
      icon: <HomeIcon />,
      iconOnly: true,
    },
    {
      id: 'available_liveries',
      label: CurrentLocal.translate('manager.tabs.tab_labels.available_liveries'),
      iconOnly: false,
    },
    {
      id: 'installed_liveries',
      label: CurrentLocal.translate('manager.tabs.tab_labels.installed_liveries'),
      iconOnly: false,
    },
    {
      id: 'settings',
      label: CurrentLocal.translate('manager.tabs.tab_labels.settings'),
      iconOnly: false,
    },
  ];

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (_, newValue) => {
    setSelectedTab(newValue);
    onTabChange(TABS[newValue].id);
  };

  const classes = useStyles();

  return (
    <>
      <OfflineError />
      <Paper>
        <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
          {TABS.map(tab => (
            <Tab key={tab.label + tab.path} icon={tab.icon} label={tab.iconOnly ? null : tab.label} aria-label={tab.label} />
          ))}
        </Tabs>
      </Paper>
      <main className={classes.main}>
        <OverlayScrollbarsComponent
          options={{
            className: 'os-theme-dark',
            scrollbars: {
              visibility: 'auto',
              autoHide: 'move',
              autoHideDelay: 500,
            },
          }}
          className={classes.scrollbarComponent}
          style={{
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
