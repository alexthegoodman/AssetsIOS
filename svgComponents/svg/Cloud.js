import React from "react";
import Svg, { Path } from "react-native-svg";

const Cloud = props => (
<Svg width={props.width || 100} height={props.height || 100} viewBox="0 0 100 100"><Path d="M89.523 52.069c0 5.002-1.874 9.821-5.275 13.569-3.426 3.775-8.026 6.045-12.954 6.393a2.12 2.12 0 0 1-.138.005H59.014a1.957 1.957 0 1 1 0-3.914h12.07c8.016-.603 14.525-7.789 14.525-16.053 0-7.789-5.583-14.618-12.986-15.884a1.957 1.957 0 0 1-1.618-1.743c-.927-9.719-9.007-17.048-18.794-17.048-7.281 0-13.988 4.251-17.084 10.829a1.956 1.956 0 0 1-2.451 1.001 8.255 8.255 0 0 0-2.878-.507c-4.66 0-8.45 3.791-8.45 8.45 0 1.015.171 1.99.507 2.896a1.959 1.959 0 0 1-.849 2.371 13.365 13.365 0 0 0-6.614 11.503c0 7.29 5.751 13.772 12.569 14.184h14.015a1.957 1.957 0 1 1 0 3.914H26.903c-.036 0-.073-.001-.109-.003-4.383-.244-8.507-2.318-11.613-5.838-3.034-3.438-4.704-7.791-4.704-12.256 0-5.583 2.745-10.832 7.254-14.043a12.446 12.446 0 0 1-.298-2.727c0-6.817 5.546-12.364 12.363-12.364.87 0 1.726.089 2.558.265 4.008-7.091 11.628-11.588 19.856-11.588a22.744 22.744 0 0 1 15.378 5.965 22.715 22.715 0 0 1 7.128 13.186c8.536 2.171 14.807 10.272 14.807 19.437zm-29.202 3.778c.382.382.883.573 1.384.573a1.957 1.957 0 0 0 1.383-3.34L51.384 41.375a1.957 1.957 0 0 0-2.767 0L36.912 53.079a1.957 1.957 0 0 0 2.767 2.767l8.365-8.365v37.081a1.957 1.957 0 1 0 3.914 0v-37.08l8.363 8.365z"></Path></Svg>
);

export default Cloud;
