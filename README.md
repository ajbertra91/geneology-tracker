# geneology-tracker

More accurately this is a timeline custom element.

define a few element to put on your timeline:
```javascript
const GIZA_PYRAMIDS = {
    path: pyramidsImg,
    location: 2150
}
const TOWER_OF_BABEL = {
    path: towerOfBabelImg,
    location: 2250
}
const NOAH_ARK = {
    path: noahsArkImg,
    location: 2350
}
```

```html
<ajb-timeline
    start-date="-3000"
    end-date="-1000"
    interval="500"
    timeline-title="Egyptologists"
    .elements=${[
        GIZA_PYRAMIDS,
        TOWER_OF_BABEL,
        NOAH_ARK
    ]}
></ajb-timeline>
```