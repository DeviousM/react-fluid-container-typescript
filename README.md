## React Fluid Container for Typescript

[![npm version](https://badge.fury.io/js/react-fluid-container-typescript.svg)](https://badge.fury.io/js/react-fluid-container-typescript)
[![Dependency Status](https://david-dm.org/souporserious/react-fluid-container-typescript.svg)](https://david-dm.org/souporserious/react-fluid-container-typescript)

Fork of [react-fluid-container](https://github.com/souporserious/react-fluid-container)

Graceful dynamic/variable height animation.

This fork works with React 16 and contains Typescript typings in case you needed one. 
It works only as a module, though let's face it - who doesn't use bundlers these days :wink:

## Install

`npm install react-fluid-container-typescript --save`

```js
import { FluidContainer } from 'react-fluid-container-typescript'

class App extends Component {
  constructor() {
    super(props)
    this.state = {
      showPanel: false
    }
  }

  render() {
    const { showPanel } = this.state
    return (
      <div className="accordion">
        <div
          onClick={() => this.setState({ showPanel: !showPanel })}
          className="accordion-title"
        >
          Toggle accordion
        </div>
        <FluidContainer
          height={showPanel ? 'auto' : 0}
          className="accordion-panel"
        >
          <div>Auto height animation!</div>
        </FluidContainer>
      </div>
    )
  }
}
```

## Props

#### `tag`: string

The wrapping element around your only `child` element. Defaults to `div`. Any other valid props like `className` will be passed to this element.

#### `height`: 'auto' | number

The height value you want to animate to. Defaults to `auto`.

#### `rmConfig`: { val: number; stiffness: number; damping: number; precision: number; }

Pass in any valid [React Motion config object](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig).

#### `children`: React.ReactNode

Only one child is allowed and is what the measurements will be based off of. This should be considered a pretty "dumb" element that is just a wrapper to measure off of. Make sure there are no margins are "hanging" outside of your elements. You can use 1px padding to avoid this.

#### `beforeAnimation`: (currentHeight: number, nextHeight: number) => void;

Callback before animation has started. Passes in previous and next heights.

#### `afterAnimation`: () => void

Callback after animation has completed.
