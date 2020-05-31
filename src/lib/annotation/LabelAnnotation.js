

import React, { Component } from "react";
import PropTypes from "prop-types";
import { functor } from "../utils";

let nextId = 1;

class LabelAnnotation extends Component {
	constructor(props) {
		super(props);
    this.state = {
      mouseOver: false,
      id: nextId++,
    };
		this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}
	handleClick(e) {
		const { onClick } = this.props;

		if (onClick) {
			const { xScale, yScale, datum } = this.props;
			onClick({ xScale, yScale, datum }, e);
		}
	}
  handleMouseEnter(e) {
    this.setState({mouseOver: true});
    var onMouseEnter = this.props.onMouseEnter;
    if ( onMouseEnter ) {
      var _props = this.props,
        xScale = _props.xScale,
        yScale = _props.yScale,
        datum = _props.datum;
      onMouseEnter({ xScale: xScale, yScale: yScale, datum: datum }, e);
    }
  }
  handleMouseLeave(e) {
    this.setState({mouseOver: false});
    var onMouseLeave = this.props.onMouseLeave;
    if ( onMouseLeave ) {
      var _props = this.props,
        xScale = _props.xScale,
        yScale = _props.yScale,
        datum = _props.datum;
      onMouseLeave({ xScale: xScale, yScale: yScale, datum: datum }, e);
    }
  }
	render() {
		const { className, textAnchor, fontFamily, fontSize, opacity, rotate, bubble } = this.props;
		const { xAccessor, xScale, yScale } = this.props;
    const { mouseOver } = this.state;
		const { xPos, yPos, fill, text, tooltip } = helper(this.props, xAccessor, xScale, yScale);
    const sw = bubble ? bubble.w || 240 : 240;
    const sh = bubble ? bubble.h || 80 : 80;
    let bubbleText = bubble ? bubble.text : null; 
    const bubbleFill = bubble ? bubble.fill || (fill || '#3d3d3d') : (fill || '#3d3d3d');
    const bubbleColor = bubble ? bubble.color : 'white';
    const bubbleFontSize = bubble ? bubble.fontSize || '8px' : '8px';
    if ( mouseOver && bubble && bubbleText && typeof bubbleText === 'function' ) {
      const { xScale, yScale, datum } = this.props;
      bubbleText = bubbleText({ xScale, yScale, datum }) || '';
    }
    bubbleText = bubble ? typeof bubbleText === 'string' ? bubbleText : '' : null;
		return (<g className={className}>
			<title>{tooltip}</title>
      {mouseOver && bubble && bubbleText && [ 
        <polygon key={0}
                 points={`${xPos-8},${yPos-(sw/2)-3} ${xPos},${yPos-15} ${xPos+8},${yPos-(sw/2)-3}`}
                 style={{fill: 'blue'}}
        />,
        <rect key={1}
            x={xPos - (sw/2)}
            y={yPos - (sh*2)}
            rx={'5px'}
            ry={'5px'}
            width={`${sw}px`}
            height={`${sh}px`}
            fill={`${bubbleFill}`}
        />,
        <foreignObject key={2} 
                       x={xPos - (sw/2)}
                       y={yPos - (sh*2)}
                       width={`${sw}px`}
                       height={`${sh}px`}>
          <div style={{color: bubbleColor, fontSize: bubbleFontSize, margin: '5px'}}>
            {bubbleText}
          </div>
        </foreignObject>
      ]}
			<text x={xPos} y={yPos}
				fontFamily={fontFamily} fontSize={fontSize}
				fill={fill}
				opacity={opacity}
				transform={`rotate(${rotate}, ${xPos}, ${yPos})`}
				onClick={this.handleClick}
        onMouseOver={this.handleMouseEnter}
        onMouseOut={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
				textAnchor={textAnchor}>{text}</text>
		</g>);
	}
}

export function helper(props, xAccessor, xScale, yScale) {
	const { x, y, datum, fill, text, tooltip, plotData } = props;

	const xFunc = functor(x);
	const yFunc = functor(y);

	const [xPos, yPos] = [xFunc({ xScale, xAccessor, datum, plotData }), yFunc({ yScale, datum, plotData })];

	return {
		xPos,
		yPos,
		text: functor(text)(datum),
		fill: functor(fill)(datum),
		tooltip: functor(tooltip)(datum),
	};
}

LabelAnnotation.propTypes = {
	className: PropTypes.string,
	text: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func
	]),
	textAnchor: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	opacity: PropTypes.number,
	rotate: PropTypes.number,
	onClick: PropTypes.func,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	datum: PropTypes.object,
	x: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
	]),
	y: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
	])
};

export const defaultProps = {
	textAnchor: "middle",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	opacity: 1,
	rotate: 0,
	x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
};

LabelAnnotation.defaultProps = {
  ...defaultProps,
  className: "react-stockcharts-labelannotation",
};

export default LabelAnnotation;
