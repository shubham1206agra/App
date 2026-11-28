/**
 * Jest's jsdom environment with one addition: a global `setDocumentURL`, which tests call to run under a given URL, such as
 * another hostname or a callback path.
 *
 * jsdom 26 makes `window.location` non-configurable, so tests can no longer swap it for a plain object, and assigning a
 * new URL to it would start a navigation, which jsdom doesn't implement. `reconfigure` is jsdom's public API for this case:
 * it changes the document's URL in place, without navigating or loading anything, so no request leaves the test.
 */
import {TestEnvironment as JSDOMEnvironment} from 'jest-environment-jsdom';

class AppTestEnvironment extends JSDOMEnvironment {
    constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
        super(...args);
        const setDocumentURL = (url: string) => {
            this.dom?.reconfigure({url});
        };
        Object.assign(this.global, {setDocumentURL});
    }
}

export default AppTestEnvironment;
