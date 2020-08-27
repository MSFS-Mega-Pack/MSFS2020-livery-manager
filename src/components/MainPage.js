import React from 'react';
import PropTypes from 'prop-types';

import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';

import HomeIcon from 'mdi-react/HomeIcon';
import SettingsIcon from 'mdi-react/SettingsIcon';

import { AllRoutes } from '../data/Routes';
import Navigate from '../helpers/Navigate';

const useStyles = makeStyles({
  root: {
    // flexGrow: 1,
  },
});

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
      // icon: <SettingsIcon />,
      iconOnly: false,
    },
  ];

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    onTabChange(TABS[newValue].label);
  };

  const classes = useStyles();

  const { children, onTabChange, onBeforeTabChange } = props;

  return (
    <>
      <Paper className={classes.root}>
        <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
          {TABS.map(tab => (
            <Tab key={tab.label + tab.path} icon={tab.icon} label={tab.iconOnly ? null : tab.label} aria-label={tab.label} />
          ))}
        </Tabs>
      </Paper>
      <main style={{ padding: 16, marginTop: 16, flex: '1' }}>{children}</main>
    </>
  );
}

MainPage.propTypes = {
  children: PropTypes.node.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onBeforeTabChange: PropTypes.func,
};
