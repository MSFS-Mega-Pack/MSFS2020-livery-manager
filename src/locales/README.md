# Translating the Liveries Mega Pack Manager

Thanks for helping to translate the liveries mega pack manager!

**This project relies on people translating strings correctly. Please don't use Google Translate: only contribute if you're fluent in English and the language you're adding!**

## Guide

In this guide, we assume that you already have copy of the repository locally.

1. Create a copy of the `en-GB` folder
2. Rename the folder to the correct language tag for your country (usually `language-COUNTRY`, which each code normally being only two letters)
 - Not sure? Check out [this list](https://stackoverflow.com/a/28357857/11091039).
3. Add the line below to the `src/locales/index.js` file:
 - Make sure to change `enGB` and `en-GB` to the language code used for the folder.

```js
export { default as enGB } from "./en-GB";
```

4. Update your locale's JSON (`src/locales/<folder>/locale.json`) with the name and ID of your language:

```jsonc
{
   "info": {
      "name": "Pirate Speak",
      "localeId": "en-PIRATE"
   },
   "strings": {
      // ...
   }
}
```

5. Start updating strings!

## Important notes

- Do not rename any of the text inside curly braces (e.g. `{{percentage}}`). These are used in the software to embed data inside the translations.
- Make sure that any pluralisations match the English (don't mistranslate "houses" to "house").
- Don't use any slang or region-specific terms (e.g. say "friends", not "mandem").
- Context is key! Make sure the translations make sense in each situation. If verbs are conjugated differently depending on the person actioning them (e.g. the manager vs the user), reflect that in your translations (e.g. on a button say "Go home", instead of "Goes home").
- Keep it casual. Don't make it sound like a business meetings, instead try to be friendly. (e.g. say "Make sure your community folder is right" instead of "Ensure that your community packages directory is correct".)
  - The easiest way to do this in English is contractions (i.e. "it is" -> "it's")

## Questions and requests

If you see a translation used in multiple different places, let us know so we can change it by opening a GitHub issue.

If you have any other questions, please open a GitHub issue.