import "react";

// type CustomProp = { [key in `--${string}`]: string };

// declare module "react" {
//   export interface CSSProperties extends CustomProp {}
// }

declare module 'react' {
  interface CSSProperties {
    // '--color': string;
      [key: `--${string}`]: string | number
  }
}