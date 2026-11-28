/**
 * Routes `window.location.assign`, `replace` and `reload` to the given mocks, so tests can assert on navigations.
 *
 * jsdom 26 makes those methods non-configurable on `window.location`, so `jest.spyOn` and `Object.defineProperty` can't
 * replace them, and jsdom doesn't implement navigation, so a real call can't be observed either. The public `Location`
 * object forwards every call to an internal implementation object, so the mocks are placed on that object instead. A call
 * then lands on the mock and never starts a navigation or a request.
 *
 * This relies on jsdom internals. If jsdom stops exposing the implementation object, this throws instead of letting the
 * tests silently pass. To change the URL itself, use `setDocumentURL`.
 */
type NavigationMocks = {
    assign?: (url: string) => void;
    replace?: (url: string) => void;
    reload?: () => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

/** Returns a function that puts the real navigation methods back */
function interceptWindowNavigation(mocks: NavigationMocks): () => void {
    const implSymbol = Object.getOwnPropertySymbols(window.location).find((symbol) => symbol.description === 'impl');
    const locationImpl: unknown = implSymbol ? Reflect.get(window.location, implSymbol) : undefined;
    if (!isRecord(locationImpl)) {
        throw new Error("interceptWindowNavigation: jsdom no longer exposes its Location implementation, so navigations can't be intercepted");
    }

    Object.assign(locationImpl, mocks);
    return () => {
        for (const methodName of Object.keys(mocks)) {
            Reflect.deleteProperty(locationImpl, methodName);
        }
    };
}

export default interceptWindowNavigation;
