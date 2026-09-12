# Tasbih APK-ready Android Project

This project packages the Tasbih V1 HTML/CSS/JavaScript website into an Android app using a native WebView. The web app is bundled locally, so the counter works offline.

## Easiest build without Android Studio

The project includes a GitHub Actions workflow at:

`.github/workflows/build-apk.yml`

1. Create a GitHub repository.
2. Upload/extract this project into the repository.
3. Commit the files to the `main` branch.
4. Open the repository's **Actions** tab.
5. Select **Build Tasbih APK**.
6. Choose **Run workflow**.
7. When the workflow finishes, open the run and download the **Tasbih-apk** artifact.
8. Extract it to get `Tasbih.apk` and install it on Android.

No Android Studio is required.

## App details
- App name: Tasbih
- Application ID: `com.tasbih.app`
- Version: 1.0
- Minimum Android: 6.0 (API 23)
- Target Android: API 35
- Offline HTML/CSS/JS assets

## Important
The APK produced by this workflow is a release build but is not Play Store-signed with a personal upload key. Android can install it when installation from the chosen source is allowed. For Play Store publishing, create/use your own signing key and configure release signing.
