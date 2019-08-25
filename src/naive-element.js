import { renderWithHooks } from "./wc-hooks/hooks-core";
import { html, render } from "lit-html";
export { html };

export const element = renderFn => {
    return class extends HTMLElement {
        connectedCallback() {
            this.render();
        }
        render() {
            const result = renderWithHooks(this, renderFn, this.render.bind(this));
            render(result, this);
        }
    };
};
