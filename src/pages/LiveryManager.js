import React from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  AppBar,
  Toolbar,
  List,
  Drawer,
  makeStyles,
  IconButton,
  useTheme,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import Divider from '@material-ui/core/Divider';
import MenuIcon from 'mdi-react/MenuIcon';
import ChevronRightIcon from 'mdi-react/ChevronLeftIcon';
import HomeIcon from 'mdi-react/HomeIcon';
import CloudDownloadIcon from 'mdi-react/CloudDownloadIcon';
import LibraryAddIcon from 'mdi-react/LibraryAddIcon';
import SettingsIcon from 'mdi-react/SettingsIcon';
import { ROUTES } from '../data/Routes';
import MainPage from '../components/MainPage';

const drawerWidth = 235;
const TitleBarHeight = 28;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: '28px !important',
    '& *': {
      zIndex: 1,
    },
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    marginTop: 28,
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    marginTop: 4,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  listItemText: {
    '& span': {
      fontSize: '1em',
    },
  },
  listStyle: {
    paddingTop: 0,
  },
}));

export default function LiveryManager() {
  const styles = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.root}>
      <MainPage>
        <Typography paragraph>This is the Home page.</Typography>
      </MainPage>
    </div>
  );
}

function isCurrentPath(path) {
  let location = useLocation();
  if (path === location.pathname) {
    return true;
  }
  return false;
}
