import React from 'react';
import PropTypes from 'prop-types';
import { GetLocaleClass } from '../locales/LocaleHelpers';
import dayjs from 'dayjs';

//#region set up dayjs plugins

import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';

const dayJsPlugins = [localeData, localizedFormat];

//#endregion

const LocaleContext = React.createContext(GetLocaleClass('en-GB'));

LocaleContext.displayName = 'LocaleContext';

const LocaleProvider = ({ locale, setLocale, ...props }) => {
  const localeClass = GetLocaleClass(locale, setLocale);

  // Extend dayjs with all plugins
  dayJsPlugins.forEach(p => dayjs.extend(p));

  // Set locale in dayjs
  dayjs.locale(localeClass.dayJsLocale);

  return <LocaleContext.Provider value={localeClass} {...props} />;
};

LocaleProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
};

export default LocaleContext;

export { LocaleProvider };
