import { getStorageSerialNumber } from ".";

(async()=>{
    const strg = await getStorageSerialNumber();
    console.log(strg);
})()