import { P_ARRAY, SBOX0, SBOX1, SBOX2, SBOX3 } from "./blowfish-constants";

type Mode = "e" | "c";

class PrimewireBlowfish {
  private readonly keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  private readonly pArray: number[] = [...P_ARRAY];
  private readonly sBox0: number[] = [...SBOX0];
  private readonly sBox1: number[] = [...SBOX1];
  private readonly sBox2: number[] = [...SBOX2];
  private readonly sBox3: number[] = [...SBOX3];
  private readonly mode: Mode;

  constructor(private readonly key: string, mode: Mode = "e") {
    if (!key) {
      throw new Error("PrimewireBlowfish requires a key");
    }

    this.mode = mode === "c" ? "c" : "e";
    this.gsk(key);
  }

  public decryptBase64(payload: string): string {
    const decoded = this.bd(payload);
    const result = this.d(decoded);
    return this.trimZeros(result);
  }

  private e(value: string, iv?: string): string {
    if (this.mode === "e") {
      return this.ee(value);
    }
    if (this.mode === "c" && iv) {
      return this.ec(value, iv);
    }
    throw new Error("Unsupported Blowfish mode");
  }

  private d(value: string, iv?: string): string {
    if (this.mode === "e") {
      return this.de(value);
    }
    if (this.mode === "c" && iv) {
      return this.dc(value, iv);
    }
    throw new Error("Unsupported Blowfish mode");
  }

  private ee(value: string): string {
    const decoded = this.utf8Decode(value);
    const blockCount = Math.ceil(decoded.length / 8);
    let output = "";

    for (let index = 0; index < blockCount; index++) {
      let block = decoded.substr(index * 8, 8);
      if (block.length < 8) {
        block = block.padEnd(8, "\0");
      }

      let [left, right] = this.split64by32(block);
      [left, right] = this.encipher(left, right);
      output += this.num2block32(left) + this.num2block32(right);
    }

    return output;
  }

  private ec(value: string, iv: string): string {
    const decoded = this.utf8Decode(value);
    const blockCount = Math.ceil(decoded.length / 8);
    let output = "";

    let [leftIv, rightIv] = this.split64by32(iv);

    for (let index = 0; index < blockCount; index++) {
      let block = decoded.substr(index * 8, 8);
      if (block.length < 8) {
        block = block.padEnd(8, "\0");
      }

      let [left, right] = this.split64by32(block);
      left = this.xor(left, leftIv);
      right = this.xor(right, rightIv);
      [leftIv, rightIv] = this.encipher(left, right);
      output += this.num2block32(leftIv) + this.num2block32(rightIv);
    }

    return output;
  }

  private de(value: string): string {
    const blockCount = Math.ceil(value.length / 8);
    let output = "";

    for (let index = 0; index < blockCount; index++) {
      const block = value.substr(index * 8, 8);
      if (block.length < 8) {
        throw new Error("Invalid Blowfish block length");
      }

      let [left, right] = this.split64by32(block);
      [left, right] = this.decipher(left, right);
      output += this.num2block32(left) + this.num2block32(right);
    }

    return this.utf8Encode(output);
  }

  private dc(value: string, iv: string): string {
    const blockCount = Math.ceil(value.length / 8);
    let output = "";

    let [leftIv, rightIv] = this.split64by32(iv);

    for (let index = 0; index < blockCount; index++) {
      const block = value.substr(index * 8, 8);
      if (block.length < 8) {
        throw new Error("Invalid Blowfish block length");
      }

      let [left, right] = this.split64by32(block);
      [left, right] = this.decipher(left, right);
      left = this.xor(left, leftIv);
      right = this.xor(right, rightIv);
      leftIv = this.block32toNum(block.substring(0, 4));
      rightIv = this.block32toNum(block.substring(4, 8));
      output += this.num2block32(left) + this.num2block32(right);
    }

    return this.utf8Encode(output);
  }

  private F(value: number): number {
    const a = value >>> 24;
    const b = (value << 8) >>> 24;
    const c = (value << 16) >>> 24;
    const d = (value << 24) >>> 24;

    let result = this.addMod32(this.sBox0[a], this.sBox1[b]);
    result = this.xor(result, this.sBox2[c]);
    result = this.addMod32(result, this.sBox3[d]);
    return result;
  }

  private encipher(left: number, right: number): [number, number] {
    let temp = 0;
    for (let round = 0; round < 16; round++) {
      temp = left = this.xor(left, this.pArray[round]);
      const newRight = this.xor(this.F(left), right);
      left = newRight;
      right = temp
    }
    temp = left;
    left = right;
    right = temp;
    right = this.xor(right, this.pArray[16]);
    left = this.xor(left, this.pArray[17]);
    return [left, right];
  }

  private decipher(left: number, right: number): [number, number] {
    const initial = this.xor(left, this.pArray[17]);
    left = this.xor(right, this.pArray[16]);
    right = initial;

    for (let round = 15; round >= 0; round--) {
      const temp = left;
      left = right;
      right = temp;
      right = this.xor(this.F(left), right);
      left = this.xor(left, this.pArray[round]);
    }

    return [left, right];
  }

  private gsk(key: string) {
    let accumulator = 0;
    let index = 0;

    for (let i = 0; i < 18; i++) {
      for (let j = 4; j > 0; j--) {
        accumulator = this.fixNegative(
          (accumulator << 8) | key.charCodeAt(index)
        );
        index = (index + 1) % key.length;
      }
      this.pArray[i] = this.xor(this.pArray[i], accumulator);
      accumulator = 0;
    }

    let block: [number, number] = [0, 0];

    for (let i = 0; i < 18; i += 2) {
      block = this.encipher(block[0], block[1]);
      this.pArray[i] = block[0];
      this.pArray[i + 1] = block[1];
    }

    for (let i = 0; i < 256; i += 2) {
      block = this.encipher(block[0], block[1]);
      this.sBox0[i] = block[0];
      this.sBox0[i + 1] = block[1];
    }

    for (let i = 0; i < 256; i += 2) {
      block = this.encipher(block[0], block[1]);
      this.sBox1[i] = block[0];
      this.sBox1[i + 1] = block[1];
    }

    for (let i = 0; i < 256; i += 2) {
      block = this.encipher(block[0], block[1]);
      this.sBox2[i] = block[0];
      this.sBox2[i + 1] = block[1];
    }

    for (let i = 0; i < 256; i += 2) {
      block = this.encipher(block[0], block[1]);
      this.sBox3[i] = block[0];
      this.sBox3[i + 1] = block[1];
    }
  }

  private block32toNum(block: string): number {
    return this.fixNegative(
      (block.charCodeAt(0) << 24) |
        (block.charCodeAt(1) << 16) |
        (block.charCodeAt(2) << 8) |
        block.charCodeAt(3)
    );
  }

  private num2block32(value: number): string {
    return (
      String.fromCharCode(value >>> 24) +
      String.fromCharCode((value << 8) >>> 24) +
      String.fromCharCode((value << 16) >>> 24) +
      String.fromCharCode((value << 24) >>> 24)
    );
  }

  private xor(left: number, right: number): number {
    return this.fixNegative(left ^ right);
  }

  private addMod32(left: number, right: number): number {
    return this.fixNegative((left + right) | 0);
  }

  private fixNegative(value: number): number {
    return value >>> 0;
  }

  private split64by32(value: string): [number, number] {
    const left = value.substring(0, 4);
    const right = value.substring(4, 8);
    return [this.block32toNum(left), this.block32toNum(right)];
  }

  private utf8Decode(input: string): string {
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      if (code < 128) {
        output += String.fromCharCode(code);
      } else if (code > 127 && code < 2048) {
        output += String.fromCharCode(code >> 6 | 192);
        output += String.fromCharCode((code & 63) | 128);
      } else {
        output += String.fromCharCode(code >> 12 | 224);
        output += String.fromCharCode((code >> 6) & 63 | 128);
        output += String.fromCharCode((code & 63) | 128);
      }
    }
    return output;
  }

  private utf8Encode(input: string): string {
    let output = "";
    let index = 0;

    while (index < input.length) {
      const charCode = input.charCodeAt(index);
      if (charCode < 128) {
        output += String.fromCharCode(charCode);
        index++;
      } else if (charCode > 191 && charCode < 224) {
        const char2 = input.charCodeAt(index + 1);
        output += String.fromCharCode(((31 & charCode) << 6) | (63 & char2));
        index += 2;
      } else {
        const char2 = input.charCodeAt(index + 1);
        const char3 = input.charCodeAt(index + 2);
        output += String.fromCharCode(
          ((15 & charCode) << 12) | ((63 & char2) << 6) | (63 & char3)
        );
        index += 3;
      }
    }

    return output;
  }

  private be(value: string): string {
    let output = "";
    let index = 0;

    while (index < value.length) {
      const c1 = value.charCodeAt(index++);
      const c2 = value.charCodeAt(index++);
      const c3 = value.charCodeAt(index++);

      const enc1 = c1 >> 2;
      const enc2 = ((3 & c1) << 4) | (c2 >> 4);
      const enc3 = ((15 & c2) << 2) | (c3 >> 6);
      const enc4 = 63 & c3;

      if (isNaN(c2)) {
        output +=
          this.keyStr.charAt(enc1) +
          this.keyStr.charAt(enc2) +
          "==";
      } else if (isNaN(c3)) {
        output +=
          this.keyStr.charAt(enc1) +
          this.keyStr.charAt(enc2) +
          this.keyStr.charAt(enc3) +
          "=";
      } else {
        output +=
          this.keyStr.charAt(enc1) +
          this.keyStr.charAt(enc2) +
          this.keyStr.charAt(enc3) +
          this.keyStr.charAt(enc4);
      }
    }

    return output;
  }

  private bd(value: string): string {
    let output = "";
    let index = 0;
    const sanitized = value.replace(/[^A-Za-z0-9+/=]/g, "");

    while (index < sanitized.length) {
      const enc1 = this.keyStr.indexOf(sanitized.charAt(index++));
      const enc2 = this.keyStr.indexOf(sanitized.charAt(index++));
      const enc3 = this.keyStr.indexOf(sanitized.charAt(index++));
      const enc4 = this.keyStr.indexOf(sanitized.charAt(index++));

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((15 & enc2) << 4) | (enc3 >> 2);
      const chr3 = ((3 & enc3) << 6) | enc4;

      output += String.fromCharCode(chr1);
      if (enc3 !== 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(chr3);
      }
    }

    return output;
  }

  private trimZeros(value: string): string {
    return value.replace(/\0+$/g, "");
  }
}

export function decodeLinkKeys(encoded: string | null | undefined): string[] {
  if (!encoded) {
    return [];
  }

  const trimmed = encoded.trim();
  if (trimmed.length <= 10) {
    return [];
  }

  const key = trimmed.slice(-10);
  const payload = trimmed.slice(0, -10);

  try {
    const blowfish = new PrimewireBlowfish(key, "e");
    const decrypted = blowfish.decryptBase64(payload);
    return (
      decrypted
        .match(/.{1,5}/g)
        ?.map((segment) => segment.trim())
        .filter(Boolean) ?? []
    );
  } catch (error) {
    console.error("Failed to decode Primewire link keys", error);
    return [];
  }
}

