import { test } from "node:test";
import assert from "node:assert/strict";
import { plane, validQuad, cameraAxes } from "./geometry.js";
test("Reference corners and inverse preserve physical size", () => {
  const p = [
      [0.2, 0.2],
      [0.7, 0.25],
      [0.85, 0.8],
      [0.1, 0.7],
    ],
    h = plane(p, 29.7, 21);
  [
    [0, 0],
    [29.7, 0],
    [29.7, 21],
    [0, 21],
  ].forEach((a, i) =>
    h
      .transform(...a)
      .forEach((v, j) => assert.ok(Math.abs(v - p[i][j]) < 1e-6)),
  );
  const q = h.transformInverse(...h.transform(48, 36.5));
  assert.ok(Math.abs(q[0] - 48) < 1e-6 && Math.abs(q[1] - 36.5) < 1e-6);
});

test('Actual A4 photo: EXIF focal length and metric plane remain consistent',()=>{
  const h=plane([[389/1368,1277/1824],[751/1368,1207/1824],[869/1368,1358/1824],[440/1368,1457/1824]],29.7,21);
  const c=cameraAxes(h.coeffs,.75,26);
  assert.ok(c.error<.08);
  assert.ok(Math.abs(c.f-1.502313)<.00001);
  assert.ok(c.vertical[1]>0&&c.vertical[2]<0,'Height rises towards the camera');
  const swapped=cameraAxes(plane([[389/1368,1277/1824],[751/1368,1207/1824],[869/1368,1358/1824],[440/1368,1457/1824]],21,29.7).coeffs,.75,26);
  assert.ok(swapped.error>.35,'Wrong paper orientation must be flagged');
});
test("Crossed, collapsed and reversed corners are rejected", () => {
  assert.equal(
    validQuad([
      [0, 0],
      [1, 1],
      [1, 0],
      [0, 1],
    ]),
    false,
  );
  assert.throws(() =>
    plane(
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      30,
      20,
    ),
  );
  assert.throws(() =>
    plane(
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      0,
      20,
    ),
  );
});
