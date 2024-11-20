export const XOREncryption = async (CodeKey: string, DataIn: string): Promise<string> => {
  if (!CodeKey) return 'CodeKey is undefined, null, or empty.'
  if (!DataIn) return 'DataIn is undefined, null, or empty.'
  let strDataOut = ''
  for (let lonDataPtr = 0; lonDataPtr < DataIn.length; lonDataPtr++) {
    const intXOrValue1 = DataIn.charCodeAt(lonDataPtr)
    const intXOrValue2 = CodeKey.charCodeAt(lonDataPtr % CodeKey.length)
    const temp = intXOrValue1 % 256 ^ intXOrValue2 % 256
    let tempstring = temp.toString(16).toUpperCase()
    if (tempstring.length === 1) tempstring = '0' + tempstring
    strDataOut += tempstring
  }
  return strDataOut
}
