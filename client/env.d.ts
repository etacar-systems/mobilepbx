declare module "*.svg" {
  export const ReactComponent: React.FunctionComponent<
    React.SVGAttributes<SVGAElement>
  >;
}

declare module "*.scss" {
  export default {} as Record<string, string>;
}
