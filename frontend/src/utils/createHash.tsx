// string to SHA-256 hash
export const createHash = async(str:string) => {
  const hexString = (buffer:any) => {
    const byteArray = new Uint8Array(buffer);
    // const hexCodes:string[] = [...byteArray].map(value => {
    //   const hexCode:string = value.toString(16);
    //   const paddedHexCode = hexCode.padStart(2, "0");
    //   return paddedHexCode;
    // });
    // return {byteArray, hexHash: hexCodes.join("")};
    return byteArray;
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  const byteArray = hexString(hashBuffer);

  return byteArray;
}