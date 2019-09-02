import { component, html, useState } from 'haunted';

const ExpandCollapse = ({ open, customTitle }) => {
    const [dataOpen, setDataOpen] = useState(open);
    const [dataTitle, setDataTitle] = useState(customTitle);

    return html`
        <style>
            :host {
                display: inline-block;
                margin-bottom: 1em;
                width: 100%;
            }
            :host > section {
                border-bottom: 1px solid #eee;
            }
            :host section .expandable-area {
                max-height: 0px;
                transition: max-height 0.3s ease-out;
                overflow: hidden;
            }
            :host section.is-open .expandable-area {
                max-height: 500px;
                transition: max-height 0.4s ease-in;
            }
            :host a,
            :host a i {
                height: 20px;
                width: 20px;
                display: inline-block;
            }
            :host a i {
                color: #333;
            }

            :host .title-bar  {
                border-bottom: 1px solid #eee;
            }
            :host .title-bar h2 {
                display: inline-block;
            }
        </style>
        <section class=${dataOpen ? 'is-open' : ''}>
            <div class="title-bar">
                <h2>${dataTitle}</h2>
                <button
                    href=""
                    @click=${() => setDataOpen(!dataOpen)}
                >
                    <i class=${dataOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'}></i>
                    <span>${dataOpen ? 'Collapse': 'Expand'}</span>
                </button>
            </div>
            <section class="expandable-area">
                <slot></slot>
            </section>
        </section>
    `;
};

customElements.define("ajb-expand-collapse", component(ExpandCollapse, { observedAttributes: ['open','custom-title'] }));
