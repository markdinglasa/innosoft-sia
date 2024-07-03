
export const XORDecryption = async (CodeKey: string, DataIn: string): Promise<string> => {
    if (!CodeKey) return 'CodeKey is undefined, null, or empty.';
    if (!DataIn) return 'DataIn is undefined, null, or empty.';
    let strDataOut = '', intXOrValue1: number, intXOrValue2: number;
    for (let lonDataPtr = 0; lonDataPtr < DataIn.length; lonDataPtr += 2) {
        intXOrValue1 = parseInt(DataIn.substr(lonDataPtr, 2), 16);
        intXOrValue2 = CodeKey.charCodeAt(lonDataPtr / 2 % CodeKey.length);
        strDataOut += String.fromCharCode(intXOrValue1 ^ intXOrValue2);
    } return strDataOut;
};