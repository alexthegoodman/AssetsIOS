### Nothing is of concern to you except /app/, gulpfile.js, and package.json
The rest is "frozen" or sensitive configuration files.

The /app/ starts at store.js, which uses routes.js.
store.js also uses /redux/create.js to create redux store and integrate redux reducers.

/sass/ is processed into /css/
some /img/ files are processed into /svgComponents/
/helpers/ provides the middleman functions for interacting with the API.
/fonts/ are auto-linked via package.json and react-native link
/components/ and /containers/ are the actual react component files
/beyondtoolbox/ is the re-usable beyond components (will be moved to NPM as a dependency)

dependencies are frozen to avoid un-planned updates.

run "gulp" to watch /sass/ to /css/