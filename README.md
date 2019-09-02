# genealogy-tracker
This is an experiment to use [parcel](https://github.com/parcel-bundler/parcel), [haunted](https://github.com/matthewp/haunted), and [lit-html](https://github.com/Polymer/lit-html) to create some custom elements. I first started witht the idea of trying to make a genealogy tree app... but quickly decided that I wanted to create a timeline tool for displaying custom timelines for Bible studies.

# How to Use
define a few elements to put on your timeline:
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

## Outstanding Issue
Right now the elements that you add to the timeline are including in the flexbox calculation and evenly distrubuted with the other timeline intervals.