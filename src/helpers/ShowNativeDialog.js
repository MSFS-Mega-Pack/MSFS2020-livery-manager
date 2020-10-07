import Electron from 'electron';

export default function ShowNativeDialog(message, title, detail = '', buttons = ['&Yes', '&No', '&Cancel'], type = 'warning') {
  return Electron.remote.dialog.showMessageBoxSync(Electron.remote.getCurrentWindow(), {
    accessibleTitle: title,
    type: type,
    buttons: buttons,
    message: message,
    detail: detail,
    isModal: true,
    isAlwaysOnTop: true,
    noLink: true,
  });
}
