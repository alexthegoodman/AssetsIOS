import React from "react";
import Svg, { Path } from "react-native-svg";

const Grid = props => (
<Svg width={props.width || 30} height={props.height || 30} viewBox="0 0 30 30">
  <Path fill={props.color} d="M5 5h8v8H5V5zm0 12h8v8H5v-8zM17 5h8v8h-8V5zm0 12h8v8h-8v-8zM6 6h6v6H6V6zm0 12h6v6H6v-6zM18 6h6v6h-6V6zm0 12h6v6h-6v-6z" fill-rule="evenodd"></Path></Svg>
);

export default Grid;
