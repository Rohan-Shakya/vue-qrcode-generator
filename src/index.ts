import VueQRCode from "./VueQRCode";

export type Level = "L" | "M" | "Q" | "H";
export type RenderAs = "canvas" | "svg";
export type ImageSettings = {
  src: string;
  x?: number;
  y?: number;
  height: number;
  width: number;
  excavate?: boolean;
};

export default VueQRCode;
