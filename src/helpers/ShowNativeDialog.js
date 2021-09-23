import * as ElectronRemote from '@electron/remote';

/**
 * Show a native Windows dialog.
 *
 * @export
 * @param {import("../locales/Locale").default} CurrentLocale The active locale
 * @param {string} message The text to show in the dialog body
 * @param {string} title The text to show in the dialog titlebar
 * @param {string} [detail=""] The text to show in the dialog details
 * @param {string} [buttons=['&Yes', '&No', '&Cancel']] The buttons to be shown on the dialog
 *
 * Note that the default "Yes, No, Cancel" buttons are displayed in the CurrentLocale
 * @param {string} [type='warning'] The type of dialog to display
 * @return {number} Index of button selected
 */
export default function ShowNativeDialog(CurrentLocale, message, title, detail = '', buttons, type = 'warning') {
  const b = buttons
    ? buttons
    : [
        CurrentLocale.translate('helpers.show_native_dialog.yes_button'),
        CurrentLocale.translate('helpers.show_native_dialog.no_button'),
        CurrentLocale.translate('helpers.show_native_dialog.cancel_button'),
      ];

  return ElectronRemote.dialog.showMessageBoxSync(ElectronRemote.getCurrentWindow(), {
    accessibleTitle: title,
    type: type,
    buttons: b,
    message: message,
    detail: detail,
    isModal: true,
    isAlwaysOnTop: true,
    noLink: true,
  });
}
