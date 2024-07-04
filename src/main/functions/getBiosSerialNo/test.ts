import { getBiosSerialNumber } from ".";

(async () => {
    const bios = await getBiosSerialNumber();
    console.log(bios)
})();