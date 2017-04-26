import React from "react";
import Svg, { Path } from "react-native-svg";

const Square = props => (
<Svg width={props.width || 50} height={props.height || 50} viewBox="0 0 50 50"><Path d="M16.113 5.044c-5.553 0-10.068 4.52-10.068 10.068v18.773c0 5.551 4.515 10.069 10.068 10.069h18.773c5.553 0 10.069-4.519 10.069-10.069V15.113c0-5.553-4.517-10.068-10.069-10.068m6.044 28.839a6.049 6.049 0 0 1-6.044 6.04H16.113a6.05 6.05 0 0 1-6.041-6.04V15.109a6.05 6.05 0 0 1 6.041-6.042h18.773a6.05 6.05 0 0 1 6.044 6.042v18.775z"></Path></Svg>
);

export default Square;
