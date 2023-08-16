
// string to SHA-256 hash
export const useHash = async(str:string) => {
  const hexString = (buffer) => {
    const byteArray = new Uint8Array(buffer);
    const hexCodes:string[] = [...byteArray].map(value => {
      const hexCode:string = value.toString(16);
      const paddedHexCode = hexCode.padStart(2, "0");
      return paddedHexCode;
    });
    return hexCodes.join("");
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  const hexHash = hexString(hashBuffer);
  console.log(hexHash);

  return hexHash;
}