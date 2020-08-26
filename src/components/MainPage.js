import React from 'react';

import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';

import HomeIcon from 'mdi-react/HomeIcon';
import SettingsIcon from 'mdi-react/SettingsIcon';

import { ROUTES } from '../data/Routes';
import Navigate from '../helpers/Navigate';

const TABS = [
  {
    label: 'Dashboard',
    icon: <HomeIcon />,
    iconOnly: true,
    path: ROUTES.DASHBOARD,
  },
  {
    label: 'Available liveries',
    iconOnly: false,
    path: ROUTES.LIVERY_MANAGER,
  },
  {
    label: 'Installed liveries',
    iconOnly: false,
    path: ROUTES.LIVERY_MANAGER,
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    iconOnly: false,
    path: ROUTES.SETTINGS,
  },
];

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function MainPage(props) {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const classes = useStyles();

  const { children } = props;

  return (
    <>
      <Paper className={classes.root}>
        <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
          {TABS.map(tab => (
            <LinkTab
              key={tab.label + tab.path}
              route={tab.path}
              icon={tab.icon}
              label={tab.iconOnly ? null : tab.label}
              aria-label={tab.label}
            />
          ))}
        </Tabs>
      </Paper>
      <main>{children}</main>
    </>
  );
}

function LinkTab({ route, ...props }) {
  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
        Navigate(route);
      }}
      {...props}
    />
  );
}
