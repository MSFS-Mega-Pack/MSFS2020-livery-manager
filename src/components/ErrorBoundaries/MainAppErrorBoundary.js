import React from 'react';
import PropTypes from 'prop-types';
import LocaleContext from '../../locales/LocaleContext';

import { Button, Typography } from '@material-ui/core';
import ErrorIcon from 'mdi-react/ErrorOutlineIcon';

import { remote as ElectronRemote } from 'electron';
import { withStyles } from '@material-ui/styles';
import { withSnackbar } from 'notistack';
import ResetConfig from '../../helpers/ResetConfig';
import IsDev from '../../data/IsDev';
import { AllRoutes } from '../../data/Routes';

const styles = {
  root: {
    maxWidth: 700,
    width: '100%',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  errorIcon: {
    width: '1em',
    height: '1em',
    transform: 'translateY(0.125em)',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
};

class MainAppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, clearingData: false };
  }

  static contextType = LocaleContext;

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const Constants = require('../../data/Constants.json');
    const Sentry = require('@sentry/electron');

    Sentry.init({
      dsn: Constants.urls.sentryDSN,
      environment: process.env.NODE_ENV,
      enableNative: true,
      debug: true,
      attachStacktrace: true,
    });

    Sentry.captureException(`${error}\n\n${errorInfo}`, {
      tags: {
        errorBoundary: 'MainAppErrorBoundary',
      },
    });
  }

  clearManagerData() {
    this.setState({
      clearingData: true,
    });

    ResetConfig();

    this.restartManager();
  }

  restartManager() {
    if (!IsDev) {
      ElectronRemote.app.relaunch();
      ElectronRemote.app.exit();
    } else {
      // workaround for reset during dev
      window.__navigate(AllRoutes.SPLASH_SCREEN);
      this.setState({
        hasError: false,
        clearingData: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      const { classes } = this.props;

      // You can render any custom fallback UI
      return (
        <section className={classes.root}>
          <Typography variant="h4" component="h1" gutterBottom>
            <ErrorIcon className={classes.errorIcon} /> {this.context.translate('manager.error_boundary.main_app.heading')}
          </Typography>
          <Typography variant="body1" paragraph>
            {this.context.translate('manager.error_boundary.main_app.description')}
          </Typography>
          <Typography variant="body1" paragraph>
            {this.context.translate('manager.error_boundary.main_app.suggestions')}
          </Typography>

          <div className={classes.buttonContainer}>
            <Button onClick={this.restartManager.bind(this)}>{this.context.translate('manager.error_boundary.main_app.restart')}</Button>
            <Button onClick={this.clearManagerData.bind(this)} disabled={this.state.clearingData}>
              {this.context.translate('manager.pages.settings.user_settings.reset_manager_to_defaults.reset_btn')}
            </Button>
          </div>

          <Typography variant="caption" paragraph>
            {this.context.translate('manager.pages.settings.user_settings.reset_manager_to_defaults.detail')}
          </Typography>
        </section>
      );
    }

    return this.props.children;
  }
}

MainAppErrorBoundary.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(withStyles(styles)(MainAppErrorBoundary));
