import { registerHook, getElementUpdateFn } from "./hooks-core";

const stateMap = new WeakMap();

const updateState = (element, hookID, elementUpdateFn, newValue) => {
    const currentValue = stateMap.get(element).get(hookID);
    if (currentValue === newValue) {
        return;
    }
    stateMap.get(element).set(hookID, newValue);
    if (elementUpdateFn) {
        elementUpdateFn();
    }
};

/**
 * Prupose: Manage local state within a component
 * Example Usage:
 * ```
 * const [ state, setState ] = useState(initialValue);
 * ```
 */
export const useState = initialValue => {
    let [element, hookID] = registerHook("useState");
    const elementUpdateFn = getElementUpdateFn();

    //ensure map exists for this element
    if (!stateMap.has(element)) {
        stateMap.set(element, new Map());
    }

    //if no entry for this hookID, store initialValue
    if (!stateMap.get(element).has(hookID)) {
        //get value from callback and store it
        updateState(element, hookID, null, initialValue);
    }

    //return value and a function to update the value
    return [
        stateMap.get(element).get(hookID),
        updateState.bind(null, element, hookID, elementUpdateFn)
    ];
};
