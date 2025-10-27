"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeLinkKeys = decodeLinkKeys;
const blowfish_constants_1 = require("./blowfish-constants");
class PrimewireBlowfish {
    constructor(key, mode = "e") {
        this.key = key;
        this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        this.pArray = [...blowfish_constants_1.P_ARRAY];
        this.sBox0 = [...blowfish_constants_1.SBOX0];
        this.sBox1 = [...blowfish_constants_1.SBOX1];
        this.sBox2 = [...blowfish_constants_1.SBOX2];
        this.sBox3 = [...blowfish_constants_1.SBOX3];
        if (!key) {
            throw new Error("PrimewireBlowfish requires a key");
        }
        this.mode = mode === "c" ? "c" : "e";
        this.gsk(key);
    }
    decryptBase64(payload) {
        const decoded = this.bd(payload);
        const result = this.d(decoded);
        return this.trimZeros(result);
    }
    e(value, iv) {
        if (this.mode === "e") {
            return this.ee(value);
        }
        if (this.mode === "c" && iv) {
            return this.ec(value, iv);
        }
        throw new Error("Unsupported Blowfish mode");
    }
    d(value, iv) {
        if (this.mode === "e") {
            return this.de(value);
        }
        if (this.mode === "c" && iv) {
            return this.dc(value, iv);
        }
        throw new Error("Unsupported Blowfish mode");
    }
    ee(value) {
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
    ec(value, iv) {
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
    de(value) {
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
    dc(value, iv) {
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
    F(value) {
        const a = value >>> 24;
        const b = (value << 8) >>> 24;
        const c = (value << 16) >>> 24;
        const d = (value << 24) >>> 24;
        let result = this.addMod32(this.sBox0[a], this.sBox1[b]);
        result = this.xor(result, this.sBox2[c]);
        result = this.addMod32(result, this.sBox3[d]);
        return result;
    }
    encipher(left, right) {
        let temp = 0;
        for (let round = 0; round < 16; round++) {
            temp = left = this.xor(left, this.pArray[round]);
            const newRight = this.xor(this.F(left), right);
            left = newRight;
            right = temp;
        }
        temp = left;
        left = right;
        right = temp;
        right = this.xor(right, this.pArray[16]);
        left = this.xor(left, this.pArray[17]);
        return [left, right];
    }
    decipher(left, right) {
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
    gsk(key) {
        let accumulator = 0;
        let index = 0;
        for (let i = 0; i < 18; i++) {
            for (let j = 4; j > 0; j--) {
                accumulator = this.fixNegative((accumulator << 8) | key.charCodeAt(index));
                index = (index + 1) % key.length;
            }
            this.pArray[i] = this.xor(this.pArray[i], accumulator);
            accumulator = 0;
        }
        let block = [0, 0];
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
    block32toNum(block) {
        return this.fixNegative((block.charCodeAt(0) << 24) |
            (block.charCodeAt(1) << 16) |
            (block.charCodeAt(2) << 8) |
            block.charCodeAt(3));
    }
    num2block32(value) {
        return (String.fromCharCode(value >>> 24) +
            String.fromCharCode((value << 8) >>> 24) +
            String.fromCharCode((value << 16) >>> 24) +
            String.fromCharCode((value << 24) >>> 24));
    }
    xor(left, right) {
        return this.fixNegative(left ^ right);
    }
    addMod32(left, right) {
        return this.fixNegative((left + right) | 0);
    }
    fixNegative(value) {
        return value >>> 0;
    }
    split64by32(value) {
        const left = value.substring(0, 4);
        const right = value.substring(4, 8);
        return [this.block32toNum(left), this.block32toNum(right)];
    }
    utf8Decode(input) {
        let output = "";
        for (let i = 0; i < input.length; i++) {
            const code = input.charCodeAt(i);
            if (code < 128) {
                output += String.fromCharCode(code);
            }
            else if (code > 127 && code < 2048) {
                output += String.fromCharCode(code >> 6 | 192);
                output += String.fromCharCode((code & 63) | 128);
            }
            else {
                output += String.fromCharCode(code >> 12 | 224);
                output += String.fromCharCode((code >> 6) & 63 | 128);
                output += String.fromCharCode((code & 63) | 128);
            }
        }
        return output;
    }
    utf8Encode(input) {
        let output = "";
        let index = 0;
        while (index < input.length) {
            const charCode = input.charCodeAt(index);
            if (charCode < 128) {
                output += String.fromCharCode(charCode);
                index++;
            }
            else if (charCode > 191 && charCode < 224) {
                const char2 = input.charCodeAt(index + 1);
                output += String.fromCharCode(((31 & charCode) << 6) | (63 & char2));
                index += 2;
            }
            else {
                const char2 = input.charCodeAt(index + 1);
                const char3 = input.charCodeAt(index + 2);
                output += String.fromCharCode(((15 & charCode) << 12) | ((63 & char2) << 6) | (63 & char3));
                index += 3;
            }
        }
        return output;
    }
    be(value) {
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
            }
            else if (isNaN(c3)) {
                output +=
                    this.keyStr.charAt(enc1) +
                        this.keyStr.charAt(enc2) +
                        this.keyStr.charAt(enc3) +
                        "=";
            }
            else {
                output +=
                    this.keyStr.charAt(enc1) +
                        this.keyStr.charAt(enc2) +
                        this.keyStr.charAt(enc3) +
                        this.keyStr.charAt(enc4);
            }
        }
        return output;
    }
    bd(value) {
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
    trimZeros(value) {
        return value.replace(/\0+$/g, "");
    }
}
function decodeLinkKeys(encoded) {
    var _a, _b;
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
        return ((_b = (_a = decrypted
            .match(/.{1,5}/g)) === null || _a === void 0 ? void 0 : _a.map((segment) => segment.trim()).filter(Boolean)) !== null && _b !== void 0 ? _b : []);
    }
    catch (error) {
        console.error("Failed to decode Primewire link keys", error);
        return [];
    }
}
