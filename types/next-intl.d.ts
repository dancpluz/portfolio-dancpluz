// Makes next-intl type based on the english version

import en from '../lang/en';

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}
