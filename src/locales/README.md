# Translating the Liveries Mega Pack Manager <!-- omit in toc -->

Thanks for helping to translate the liveries mega pack manager!

**This project relies on people translating strings correctly. Please don't use Google Translate: only contribute if you're fluent in English and the language you're adding!**

## Contents <!-- omit in toc -->

- [Guide](#guide)
- [Correctly formatting dates](#correctly-formatting-dates)
  - [Simple is best: `LLLL` and `L LT`](#simple-is-best-llll-and-l-lt)
  - ["My language doesn't have a dayjs locale!"](#my-language-doesnt-have-a-dayjs-locale)
- [Syntax](#syntax)
  - [Basic strings](#basic-strings)
  - [Variables](#variables)
  - [Pluralisation](#pluralisation)
- [Important notes](#important-notes)
- [Questions and requests](#questions-and-requests)

## Guide

In this guide, we assume that you already have copy of the repository locally.

1. Create a copy of the `en-GB` folder
2. Rename the folder to the correct language tag for your country (usually `language-COUNTRY`, which each code normally being only two letters)
   - Not sure? Check out [this list](https://stackoverflow.com/a/28357857/11091039).
3. Add the line below to the `src/locales/index.js` file:
   - Make sure to change `enGB` and `en-GB` to the language code used for the folder.

```js
export * as enGB from './en-GB';
```

4. Update your locale's `index.js` file to show correct days of the week:

```js
// See full list of supported dayjs locales here
// https://github.com/iamkun/dayjs/tree/dev/src/locale

// CHANGE THIS LINE
export { default as dayJsLocale } from 'dayjs/locale/<locale id>';

// ...
```

5. Update your locale's JSON (`src/locales/<folder>/locale.json`) with the name and ID of your language:

```jsonc
{
  "info": {
    // <local language name> (<language name in english>)
    // e.g. "Português (Portuguese)"
    "name": "Arrr! (Pirate Speak)",
    "localeId": "en-PIRATE"
  },
  "strings": {
    // ...
  }
}
```

6. Start updating strings! :tada:

## Correctly formatting dates

Assuming you set the dayjs locale for your language correctly (see step 4 above), date formatting should be (almost) complete for you!

**Formatting dates is one of the most important things when translating.** Confusion is easy when languages display dates differently.

For example, in the US, they use `MM/DD/YYYY` whereas in the UK they use `DD/MM/YYYY`. Both countries speak the same language but still use different date formats. Make sure your date formats are written correctly and **in a way people would commonly see them in that language**.

> For example, don't start using `MMM YYYY DD` in English UK: reading "November 2020 31" might make sense, but it's not a date format used in the UK.

### Simple is best: `LLLL` and `L LT`

There is a super simple date format that you can use in all the JSONs and never really have problems, as long as you import the correct dayjs locale: `LLLL`.

`LLLL` tells dayjs to show "the most verbose localised date format". If you look at the table below, there are only subtle differences, and both make sense to US and UK readers, but using the "most correct" option is best.

Another great option is `L LT`. This displays the shortest possible localised date format, and the localised time.


| Format | US English                          | UK English                     |
| ------ | ----------------------------------- | ------------------------------ |
| `LLLL` | `Thursday, August 16, 2018 8:02 PM` | Thursday, 16 August 2018 20:02 |
| `L LT` | `08/16/2018 8:02 PM`                | `16/08/2018 20:02`             |

**Have any issues with these date formats?**

### "My language doesn't have a dayjs locale!"

Go make one! Contributing to open source projects like dayjs helps 10s or 100s of thousands of developers!

[Check out how they look](https://github.com/iamkun/dayjs/blob/dev/src/locale/en-gb.js), then [create your own JSON](https://github.com/iamkun/dayjs/new/dev/src/locale) and open a PR!

## Syntax

### Basic strings

```json
{
  "manager": {
    "my_string": "My cool string"
  }
}
```

"My cool string" would be accessible via "manager.my_string".

### Variables

```json
{
  "manager": {
    "my_string": "My {{type}} string"
  }
}
```

"My amazing string" would be accessible via "manager.my_string" and passing `{ type: "amazing" }` as the variables object.

### Pluralisation

**Syntax:**

```js
"[[<variable>||<singular>|<plural>]]
```

If `<variable>` is `1`, then the singular value is used,otherwise the plural value is used.

```json
{
  "manager": {
    "my_string": "I have {{count}} [[count||dog|dogs]]"
  }
}
```

"I have 2 dogs" would be accessible via "manager.my_string" and passing `{ count: 2 }` as the variables object.

"I have 1 dog" would be accessible via "manager.my_string" and passing `{ count: 1 }` as the variables object.

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
