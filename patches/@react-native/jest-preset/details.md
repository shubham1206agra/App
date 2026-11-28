# `@react-native/jest-preset` patches

### [@react-native+jest-preset+0.88.0+001+skip-window-redefine-under-jsdom.patch](@react-native+jest-preset+0.88.0+001+skip-window-redefine-under-jsdom.patch)

- Reason:

    ```
    Our Jest config runs React Native's setup file (`jest/setup.js`, pulled in by the `jest-expo` preset) under the
    `jsdom` test environment. That setup redefines `window` on the global with `Object.defineProperties`. Jest 30's
    `jest-environment-jsdom` uses jsdom 26, which makes `window` a non-configurable property of the global, so every
    test suite fails before it runs with "TypeError: Cannot redefine property: window". Under jsdom, `window` already
    points at the global, so the patch skips that one property when `global.window === global` and defines it as
    before otherwise. The other globals the setup defines are unchanged.
    ```

- Upstream PR/issue: None. React Native's own preset runs tests in its Node-based `react-native-env`, where `window` is not defined yet, so the redefinition only breaks when an app overrides `testEnvironment` to `jsdom` as we do. The setup is unchanged as of `0.90.0-nightly`. The patch can be removed if we stop running the React Native setup under `jsdom`.
- E/App issue: https://github.com/Expensify/App/issues/108261
- PR introducing patch: https://github.com/Expensify/App/pull/108259
