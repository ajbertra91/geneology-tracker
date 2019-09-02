import { component, html, useState } from 'haunted';

const NameInput = ({name, type}) => {
    const [dataName, setDataName] = useState(name);
    const [dataType, setDataType] = useState(type);

    return html`
        <style>
            :host {
                display: inline-block;
                margin-bottom: 1em;
            }
            .father,
            .mother {
                position: relative;
            }
            .father {
                margin-right: 11px;
            }
            .mother {
                margin-left: 11px;
            }
            .father::after,
            .mother::after {
                content: '';
                display: block;
                width: 10px;
                height: 30%;
                position: absolute;
                top: 70%;
                border-top: 1px solid var(--color-border, #333);
            }
            .father::after {
                right: -10px;
            }
            .mother::after {
                left: -10px;
            }
            label {
                display: block;
            }
        </style>
        <section class=${dataType}>
            <label>${dataType}</label>
            <input
                type="text"
                placeholder=${dataType === 'father' ? 'Adam' : 'Eve'}
                value=${dataName ? dataName : ''}
                @change=${e => setDataName(e.target.value)}
            />
        </section>
    `;
};

customElements.define("ajb-name-input", component(NameInput, {observedAttributes: ['name', 'type']}));
