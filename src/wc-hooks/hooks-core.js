let hooksState;

function getStack() {
    const stack = new Error().stack;
    if (stack) {
        return stack;
    }
    // if stack wasn't attached to error object, then this is IE and we need to throw to get it
    try {
        throw new Error();
    } catch (err) {
        return err.stack;
    }
}

const hooksNS = {
    // Defining unique function name as a property on an object to avoid it being renamed
    // by bundlers.
    // TODO: consider generating a unique function name at runtime
    _renderWithHooks: renderFn => {
        return renderFn();
    }
};

const onStartOfElementRender = (element, elementUpdateFn) => {
    hooksState = {
        currentElement: element,
        renderIsInProgress: true,
        hookExecutedThisRenderByStackTrace: {},
        elementUpdateFn: elementUpdateFn
    };
};

const onEndOfElementRender = () => {
    hooksState = {
        currentElement: null,
        renderIsInProgress: false,
        hookExecutedThisRenderByStackTrace: {},
        elementUpdateFn: null
    };
};

export const renderWithHooks = (element, renderFn, elementUpdateFn) => {
    onStartOfElementRender(element, elementUpdateFn);
    const renderResult = hooksNS._renderWithHooks(renderFn);
    onEndOfElementRender();
    return renderResult;
};

export const getCurrentElement = () => {
    return hooksState.currentElement;
};

export const getElementUpdateFn = () => {
    return hooksState.elementUpdateFn;
};

export const registerHook = name => {
    if (!hooksState.renderIsInProgress) {
        throw new Error(
            `Hooks must be called from within an element's render() method. ${name} was not.`
        );
    }

    const stack = getStack();
    const stackTraceId = stack.substring(0, stack.indexOf("_renderWithHooks"));
    // stackTraceId will unique unless called within a loop
    // throw an error if that is the case
    if (!hooksState.hookExecutedThisRenderByStackTrace[stackTraceId]) {
        hooksState.hookExecutedThisRenderByStackTrace[stackTraceId] = true;
    } else {
        throw new Error(
            `The ${name} hook appears to be called within a loop.  Hooks within loops is not supported.`
        );
    }

    return [hooksState.currentElement, stackTraceId];
};
