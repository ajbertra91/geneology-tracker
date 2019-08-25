import { element, html } from "../../naive-element";
import { useState } from "../../wc-hooks/use-state";
import "./styles.scss";

const NameInput = (props) => {

    const [name, setName] = useState(props.dataName);

    return html`
        <section>
            <label>Father</label>
            <input type="text" value="${name}" @change=${e => setName(e.target.value)}/>
        </section>
    `;
};

customElements.define("ajb-name-input", element(NameInput, {observedAttributes: ['data-name']}));
