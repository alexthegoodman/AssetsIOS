import React from "react";
import Svg, { Path } from "react-native-svg";

const Upload = props => (
<Svg width={props.width || 100} height={props.height || 100} viewBox="0 0 100 100">
  <Path d="M71 63H60a1 1 0 0 1 0-2h11c9.08 0 17-8.65 17-18.5 0-9.62-7.34-17.44-16.36-17.44a15.22 15.22 0 0 0-5.41.84l-.8.29-.42-.74a21.79 21.79 0 0 0-18.82-11.37 22.11 22.11 0 0 0-21.57 19.25l-.12.88H23.34C16.76 34.2 11 40.46 11 47.58S16.8 61 23.43 61H40a1 1 0 0 1 0 2H23.43C15.74 63 9 55.79 9 47.58c0-8 6.37-15 13.79-15.4a24.09 24.09 0 0 1 23.42-20.1 23.74 23.74 0 0 1 20.17 11.67 17.84 17.84 0 0 1 5.29-.69C81.8 23.06 90 31.78 90 42.5 90 53.42 81.14 63 71 63z"></Path>
  <Path d="M50 80a1 1 0 0 1-1-1V39a1 1 0 0 1 2 0v40a1 1 0 0 1-1 1z"></Path>
  <Path d="M60 49a1 1 0 0 1-.67-.26L50 40.35l-9.33 8.4a1 1 0 0 1-1.34-1.49L50 37.65l10.67 9.6A1 1 0 0 1 60 49z"></Path></Svg>
);

export default Upload;
