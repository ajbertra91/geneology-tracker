import { component, html, useState } from 'haunted';

const Timeline = ({startDate, endDate, interval, timelineTitle, elements}) => {
    // set the startDate for the timeline
    const [dataStartDate, setDataStartDate] = useState(parseInt(startDate));
    // set the endDate for the timeline
    const [dataEndDate, setDataEndDate] = useState(parseInt(endDate));
    // set the interval of ticks on the timeline
    const [dataInterval, setDataInterval] = useState(parseInt(interval));
    // set the title of the timeline
    const [dataTitle, setDataTitle] = useState(timelineTitle);
    // set the JS object of the the elements to show on the timeline
    const [dataElements, setDataElements] = useState(elements);
    let timelineArray = [];
    for (let i = dataStartDate; i <= dataEndDate; i++) {
        const label = i < 0 ? 'B.C.' : 'A.D.';
        const year = i < 0 ? Math.abs(i) : i;
        const showLabel = i % dataInterval === 0;
        const element = dataElements.filter(el => el.location === year)[0];
        timelineArray.push({
            label,
            year,
            showLabel,
            element
        })
    }

    return html`
        <style>
            :host {
                position: relative;
            }
            :host {
                display: inline-block;
                margin-bottom: 1em;
                width: 100%;
            }
            :host .timeline-baseline {
                display: flex;
                justify-content: space-evenly;
                width: 100%;
            }
            :host .timeline-interval {
                position: relative;
                margin-top: 23px;
            }
            :host .timeline-divider {
                display: inline-block;
                height: 20px;
                width: 1px;
                background-color: #333;
                position: absolute;
                top: -130%;
                left: 50%;
            }
            :host .timeline-element-img {
                position: absolute;
                top: -60px;
                left: 15px;
                height: 30px;
                width: 30px;
            }
        </style>
        <h3 class="timeline-title">${dataTitle}</h3>
        <section class="timeline-baseline">
            ${timelineArray.map((divider, idx) => {
                if (divider.showLabel) {
                    return html`
                        <span class="timeline-interval">
                            <span class="timeline-divider"></span>
                            <span class="timeline-label">${divider.year} ${divider.label}</span>
                        </span>
                    `;
                } else if (divider.element && divider.element.location) {
                    return html`
                        <span class="timeline-interval">
                            <img class="timeline-element-img" src=${divider.element.path} alt="" />
                            <span class="timeline-divider"></span>
                            <span class="timeline-label">${divider.year} ${divider.label}</span>
                        </span>
                    `;
                }
            })}
        </section>
    `;
};

customElements.define(
    "ajb-timeline",
    component(Timeline, {
        observedAttributes: [
            'start-date',
            'end-date',
            'interval',
            'timeline-title',
            'elements'
        ]
    })
);
