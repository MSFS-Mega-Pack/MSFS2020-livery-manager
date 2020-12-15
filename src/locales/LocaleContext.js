import React from 'react';
import PropTypes from 'prop-types';

import { GetLocaleClass } from '../locales/LocaleHelpers';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

const LocaleContext = React.createContext(GetLocaleClass('en-GB'));

LocaleContext.displayName = 'LocaleContext';

const LocaleProvider = ({ locale, setLocale, ...props }) => {
  const localeClass = GetLocaleClass(locale, setLocale);

  console.log(localeClass);

  dayjs.extend(localeData);
  dayjs.locale(localeClass.dayJsLocale);
  window.dayjs = dayjs;

  return <LocaleContext.Provider value={localeClass} {...props} />;
};

LocaleProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
};

export default LocaleContext;

export { LocaleProvider };
