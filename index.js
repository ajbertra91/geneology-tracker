import { component, html, useState, useReducer } from 'haunted';
import './src/components/name-input';
import './src/components/expand-collapse';
import './src/components/timeline';
import './src/main.scss';
import pyramidsImg from './src/static/images/pyramids.jpg';
import noahsArkImg from './src/static/images/noah-ark.png';
import towerOfBabelImg from './src/static/images/towerOfBabel.jpg';

const initialState = [
    {
        father: '',
        mother: ''
    }
]

const reducer = (state, action) => {
    switch (action) {
        case 'addNew':
            return [...state, {father: '', mother: ''}]
        case 'remove':
            state.pop();
            return state;
        default:
            throw new Error("what's going on?")
    }
}
const App = () => {
    const [geneology, dispatch] = useReducer(reducer,initialState);
    // CREATION SCIENTISTS TRADITITONAL
    const TRAD_GIZA_PYRAMIDS = {
        path: pyramidsImg,
        location: 2150
    }
    const TRAD_TOWER_OF_BABEL = {
        path: towerOfBabelImg,
        location: 2250
    }
    const TRAD_NOAH_ARK = {
        path: noahsArkImg,
        location: 2350
    }
    // EGYPTOLOGISTS
    const EGYPT_GIZA_PYRAMIDS = {
        path: pyramidsImg,
        location: 2550
    }
    const EGYPT_TOWER_OF_BABEL = {
        path: towerOfBabelImg,
        location: 2250
    }
    const EGYPT_NOAH_ARK = {
        path: noahsArkImg,
        location: 2350
    }
    return html`
        <style>
            .gen-couple {
                display: inline-block;
            }
            aside {
                position: absolute;
                top: 5%;
                right: 2%;
                min-height: 300px;
                width: 300px;
                border: 1px solid #ccc;
                padding: 1em;
            }
        </style>
        <main id="main">
            <ajb-expand-collapse
                open
                custom-title="Traditional Timeline"
            >
                <ajb-timeline
                    start-date="-3000"
                    end-date="-1000"
                    interval="500"
                    timeline-title="Creation Scientists"
                    .elements=${[
                        TRAD_GIZA_PYRAMIDS,
                        TRAD_TOWER_OF_BABEL,
                        TRAD_NOAH_ARK
                    ]}
                ></ajb-timeline>
                <p>Creation Scientist traditionally teach the pyramids were built at 2350 B.C. The Tower of Babel sometime after that and the Great Pyramids of Giza sometime after that.</p>
                <p>Traditionally the flood was at 2350 B.C.</p>
            </ajb-expand-collapse>

            <ajb-expand-collapse
                open
                custom-title="Traditional Timeline"
            >
                <ajb-timeline
                    start-date="-3000"
                    end-date="-1000"
                    interval="500"
                    timeline-title="Egyptologists"
                    .elements=${[
                        EGYPT_GIZA_PYRAMIDS,
                        EGYPT_TOWER_OF_BABEL,
                        EGYPT_NOAH_ARK
                    ]}
                ></ajb-timeline>
                <p>Egyptologies traditionally teach the pyramids were built at 2550 B.C. 200 eyars before the traditional flood date of 2350 B.C.</p>
                <p>How could the pyramids have been built 200 years before the flood, which was before the Tower of Babel incident? Which was before the nation of Egypt even existed?</p>
            </ajb-expand-collapse>
        </main>
    `;
};

customElements.define("ajb-app", component(App));
