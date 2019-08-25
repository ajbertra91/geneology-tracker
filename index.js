import { element, html } from "./src/naive-element";
import './src/components/name-input';
import { useState } from "./src/wc-hooks/use-state";
import "./src/main.scss";

const App = () => {
    const [geneology, setGeneology] = useState([
        {
            father: 'Adam',
            mother: 'Eve'
        }
    ]);

    return html`
        ${geneology.map(generation => {
            return html`
                <ajb-name-input data-name=${generation.father}></ajb-name-input>
                <ajb-name-input data-name=${generation.mother}></ajb-name-input>
            `;
        })}
        <button @click=${() => setGeneology([...geneology, {father: '', mother: ''}])}>
            Add Generation
        </button>
    `;
};

customElements.define("ajb-app", element(App));
