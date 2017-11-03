import React from "react";
import Svg, { Path } from "react-native-svg";

const Hamburger = props => (
<Svg width={props.width || 100} height={props.height || 100} viewBox="0 0 100 100"><Path fill={props.color} fill-rule="evenodd" clip-rule="evenodd" d="M81.602 44.102h-66.84a5.898 5.898 0 0 0 0 11.796h66.84a5.898 5.898 0 0 0 0-11.796zm0 23.591h-66.84a5.898 5.898 0 0 0 0 11.796h66.84a5.898 5.898 0 0 0 0-11.796zM14.763 32.307h66.84a5.898 5.898 0 0 0 0-11.796h-66.84a5.898 5.898 0 0 0 0 11.796z"></Path></Svg>
);

export default Hamburger;
