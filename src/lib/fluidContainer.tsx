import React from 'react';
import { Motion, spring, presets, OpaqueConfig } from 'react-motion';
import Measure, { ContentRect } from 'react-measure';

export interface FluidContainerProps {
  tag?: string;
  height?: 'auto' | number;
  children?: React.ReactNode;
  className?: string;
  rmConfig: OpaqueConfig,
  beforeAnimation?: (currentHeight: number, nextHeight: number) => void;
  afterAnimation?: () => void;
  style?: CSSStyleDeclaration;
}

export interface FluidContainerState {
  height: number;
}

export default class FluidContainer extends React.Component<FluidContainerProps, FluidContainerState> {
  state = {
    height: 0,
  }
  _heightReady: boolean = this.props.height !== 'auto'
  _currHeight: number | null = null
  _firstMeasure: boolean = true

  static defaultProps: Partial<FluidContainerProps> = {
    tag: 'div',
    height: 'auto',
    rmConfig: presets.noWobble,
    beforeAnimation: () => null,
    afterAnimation: () => null,
  };

  componentDidUpdate(lastProps: FluidContainerProps, lastState: FluidContainerState) {
    // if height has changed fire a callback before animation begins
    if (lastProps.height !== this.props.height && this.props.beforeAnimation) {
      this.props.beforeAnimation(lastProps.height as number, this.props.height as number);
    }

    // don't apply height until we have our first real measurement
    if (lastState.height > 0 || this.props.height! > 0) {
      this._heightReady = true;
    }
  }

  _handleMeasure = (bounds: ContentRect) => {
    if(bounds.bounds) {
      const { height } = bounds.bounds;
      // store the height so we can apply it to the element immediately
      // and avoid any element jumping
      if (height > 0) {
        this._currHeight = height;
      }
      if (height !== this.state.height) {
        // don't fire callback on first measure
        if (!this._firstMeasure && this.props.beforeAnimation) {
          this.props.beforeAnimation(this.state.height, height);
        } else {
          this._firstMeasure = false;
        }
  
        this.setState({ height });
      }
    }
  }

  _handleRest = () => {
    if(this.props.afterAnimation) {
      this.props.afterAnimation();
    }
  }

  _handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const child = React.Children.only(this.props.children)

    // this._measureComponent.measure()

    if (typeof child.props.onInput === 'function') {
      child.props.onInput(e)
    }
  }

  render() {
    const {
      tag,
      height,
      rmConfig,
      children,
      beforeAnimation,
      afterAnimation,
      ...restProps
    } = this.props;
    const rmHeight = height === 'auto' ? this.state.height : height;
    const child = (
      <Measure
        onResize={args => this._handleMeasure(args)}
        bounds={true}
      >
        {({ measureRef }) =>
          React.cloneElement(React.Children.only(children), {
            onInput: this._handleInput,
            ref: (node: Element) => measureRef(node),
          })}
      </Measure>
    );
    return (
      <Motion
        defaultStyle={{ _height: rmHeight! }}
        style={{
          _height: spring(rmHeight!, { 
            precision: 0.5, 
            damping: rmConfig.damping,
            stiffness: rmConfig.stiffness
          }),
        }}
        onRest={this._handleRest}
      >
        {({ _height }) =>
          React.createElement(
            tag!,
            {
              ...restProps,
              style: {
                height: this._heightReady
                  ? _height
                  : this._currHeight || 'auto',
                ...restProps.style,
              },
            },
            child
          )}
      </Motion>
    )
  }
}
