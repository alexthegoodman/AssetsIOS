import React from "react";
import Svg, { Path } from "react-native-svg";

const Back1 = props => (
<Svg width={props.width || 100} height={props.height || 100} viewBox="0 0 100 100"><Path fill={props.color} d="M74 51H28.398l17.301 17.301c.926.926-.46 2.34-1.398 1.398l-19-19c-.403-.406-.34-1.058 0-1.398l19-19c.933-.934 2.332.469 1.398 1.398L28.398 49H74c1.34 0 1.344 2 0 2z"></Path></Svg>
);

export default Back1;
