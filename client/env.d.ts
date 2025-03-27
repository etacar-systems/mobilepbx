declare module "*.svg" {
  export const ReactComponent: React.FunctionComponent<
    React.SVGAttributes<SVGAElement>
  >;
}

declare module "*.mp4" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  export default {} as Record<string, string>;
}
