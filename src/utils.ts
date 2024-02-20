import { ImageSettings } from ".";
import QR from "../lib/qr-code-generator";

export type Modules = ReturnType<QR.QrCode["getModules"]>;
export type Excavation = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const ErrorCorrectLevelMap: Readonly<Record<string, QR.QrCode.Ecc>> = {
  L: QR.QrCode.Ecc.LOW,
  M: QR.QrCode.Ecc.MEDIUM,
  Q: QR.QrCode.Ecc.QUARTILE,
  H: QR.QrCode.Ecc.HIGH,
};

export const SUPPORTS_PATH2D: boolean = (function () {
  try {
    new Path2D().addPath(new Path2D());
    return true;
  } catch (e) {
    return false;
  }
})();

export const generatePath = (modules: Modules, margin = 0): string => {
  const ops: string[] = [];
  modules.forEach(function (row, y) {
    let start: number | null = null;
    row.forEach(function (cell, x) {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(
          `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`,
        );
        start = null;
        return;
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so this can only mean
          // 2+ light modules in a row.
          return;
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
        } else {
          // Otherwise finish the current line.
          ops.push(
            `M${start + margin},${y + margin} h${x + 1 - start}v1H${
              start + margin
            }z`,
          );
        }
        return;
      }

      if (cell && start === null) {
        start = x;
      }
    });
  });
  return ops.join("");
};

export const getImageSettings = (
  cells: Modules,
  size: number,
  margin: number,
  imageSettings: ImageSettings,
): {
  x: number;
  y: number;
  h: number;
  w: number;
  excavation: Excavation | null;
} => {
  const { width, height, x: imageX, y: imageY } = imageSettings;
  const numCells = cells.length + margin * 2;
  const defaultSize = Math.floor(size * 0.1);
  const scale = numCells / size;
  const w = (width || defaultSize) * scale;
  const h = (height || defaultSize) * scale;
  const x = imageX == null ? cells.length / 2 - w / 2 : imageX * scale;
  const y = imageY == null ? cells.length / 2 - h / 2 : imageY * scale;

  let excavation = null;
  if (imageSettings.excavate) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    const ceilW = Math.ceil(w + x - floorX);
    const ceilH = Math.ceil(h + y - floorY);
    excavation = { x: floorX, y: floorY, w: ceilW, h: ceilH };
  }

  return { x, y, h, w, excavation };
};

export const excavateModules = (
  modules: Modules,
  excavation: Excavation,
): Modules => {
  return modules.slice().map((row, y) => {
    if (y < excavation.y || y >= excavation.y + excavation.h) {
      return row;
    }
    return row.map((cell, x) => {
      if (x < excavation.x || x >= excavation.x + excavation.w) {
        return cell;
      }
      return false;
    });
  });
};
