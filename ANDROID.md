# Opening Cooking Kitchen Partners in Android Studio

The app works fully offline: all recipes and ingredients are bundled, and your
kitchen data is stored on the device. No server or internet connection is used.

## One-time setup

1. Install [Android Studio](https://developer.android.com/studio) with the
   Android SDK and a JDK 21.
2. Download this project (or `git clone` it) and install dependencies:

   ```bash
   npm install
   ```

3. Build the offline web files and create the Android project:

   ```bash
   npm run build          # writes prerendered pages into dist/client
   npx cap add android    # creates the ./android folder (only needed once)
   ```

4. Open the `android` folder in Android Studio (File → Open) and press Run.

## After every change to the app

```bash
npm run build
npx cap sync android
```

Then press Run again in Android Studio.

## Notes

- `capacitor.config.ts` already points Capacitor at `dist/client`, which is the
  prerendered, static output — nothing is fetched at runtime.
- App id: `app.lovable.cookingkitchenpartners`. Change it in
  `capacitor.config.ts` before your first `npx cap add android` if you want a
  different Play Store identifier.
- Icons and the splash screen can be replaced in
  `android/app/src/main/res` once the Android project exists.
