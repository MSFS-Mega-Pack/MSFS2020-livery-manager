import React from 'react';
import PropTypes from 'prop-types';

import { GetLocaleClass } from '../locales/LocaleHelpers';

const LocaleContext = React.createContext(GetLocaleClass('en-GB'));

LocaleContext.displayName = 'LocaleContext';

const LocaleProvider = ({ locale, setLocale, ...props }) => <LocaleContext.Provider value={GetLocaleClass(locale, setLocale)} {...props} />;

LocaleProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
};

export default LocaleContext;

export { LocaleProvider };
