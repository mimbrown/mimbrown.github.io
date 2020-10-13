/* eslint-disable no-bitwise,prefer-template */

const rnds8 = new Uint8Array(16);

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex: string[] = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr: Uint8Array, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (
    byteToHex[arr[offset + 0]]
    + byteToHex[arr[offset + 1]]
    + byteToHex[arr[offset + 2]]
    + byteToHex[arr[offset + 3]]
    + '-'
    + byteToHex[arr[offset + 4]]
    + byteToHex[arr[offset + 5]]
    + '-'
    + byteToHex[arr[offset + 6]]
    + byteToHex[arr[offset + 7]]
    + '-'
    + byteToHex[arr[offset + 8]]
    + byteToHex[arr[offset + 9]]
    + '-'
    + byteToHex[arr[offset + 10]]
    + byteToHex[arr[offset + 11]]
    + byteToHex[arr[offset + 12]]
    + byteToHex[arr[offset + 13]]
    + byteToHex[arr[offset + 14]]
    + byteToHex[arr[offset + 15]]
  ).toLowerCase();

  return uuid;
}

export default function v4() {
  const rnds = crypto.getRandomValues(rnds8);

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  return stringify(rnds);
}
