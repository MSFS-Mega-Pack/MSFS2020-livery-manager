# Translating the Livery Manager

**DOCS IN PROGRESS!**

Thanks for helping to translate the livery manager!

Here's a brief step-by-step guide on how to get started.

In this guide, we assume that you already have copy of the repository locally.

1. Create a copy of the `en-GB` or `en-US` folders
2. Rename the folder to te correct language tag for your country (usually `language-COUNTRY`, which each code normally being only two letters)
   - Not sure? Check out [this list](https://stackoverflow.com/a/28357857/11091039).
3. Copy and paste the line below into `index.js`, updating it with your language code, in this folder (not the one you just copied):

```js
export {}
```