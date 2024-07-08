import { Error, Success } from '@shared/messages';
import { Response, SqlChannel } from '@shared/types';
import { createArrayCsvWriter } from 'csv-writer'; // Assuming you have a CSV writer library
import { ipcMain } from 'electron';
import fs from 'fs';
import paths from 'path';
import { recordByQuery } from '../../../model';

// Define CSV column headers based on your query result structure
const csvHeaders = [
    { id: 'OrderNumber', title: 'Order Number' },
    { id: 'BusinessDay', title: 'Business Day' },
    { id: 'CheckOpen', title: 'Check Open' },
    { id: 'CheckClose', title: 'Check Close' },
    { id: 'TransactionType', title: 'Transaction Type' },
    { id: 'Void', title: 'Void' },
    { id: 'VoidAmount', title: 'Void Amount' },
    { id: 'Refund', title: 'Refund' },
    { id: 'RefundAmount', title: 'Refund Amount' },
    { id: 'GuestCountSenior', title: 'Guest Count Senior' },
    { id: 'GuestCountPWD', title: 'Guest Count PWD' },
    { id: 'GrossSalesAmount', title: 'Gross Sales Amount' },
    { id: 'NetSalesAmount', title: 'Net Sales Amount' },
    { id: 'TotalTax', title: 'Total Tax' },
    { id: 'OtherLocalTax', title: 'Other Local Tax' },
    { id: 'TotalServiceCharge', title: 'Total Service Charge' },
    { id: 'TotalTip', title: 'Total Tip' },
    { id: 'TotalDiscount', title: 'Total Discount' },
    { id: 'LessTaxAmount', title: 'Less Tax Amount' },
    { id: 'EmployeeDiscountAmount', title: 'Employee Discount Amount' },
    { id: 'VIPDiscountAmount', title: 'VIP Discount Amount' },
    { id: 'DiscountField1Name', title: 'Discount Field 1 Name' },
    { id: 'DiscountField2Name', title: 'Discount Field 2 Name' },
    { id: 'DiscountField3Name', title: 'Discount Field 3 Name' },
    { id: 'DiscountField4Name', title: 'Discount Field 4 Name' },
    { id: 'DiscountField5Name', title: 'Discount Field 5 Name' },
    { id: 'DiscountField6Name', title: 'Discount Field 6 Name' },
    { id: 'DiscountField1Amount', title: 'Discount Field 1 Amount' },
    { id: 'DiscountField2Amount', title: 'Discount Field 2 Amount' },
    { id: 'DiscountField3Amount', title: 'Discount Field 3 Amount' },
    { id: 'DiscountField4Amount', title: 'Discount Field 4 Amount' },
    { id: 'DiscountField5Amount', title: 'Discount Field 5 Amount' },
    { id: 'DiscountField6Amount', title: 'Discount Field 6 Amount' },
    { id: 'TotalCashSalesAmount', title: 'Total Cash Sales Amount' },
    { id: 'TotalGiftCertificateSalesAmount', title: 'Total Gift Certificate Sales Amount' },
    { id: 'TotalEwalletOnlineSalesAmount', title: 'Total Ewallet Online Sales Amount' },
    { id: 'TotalMastercardSalesAmount', title: 'Total Mastercard Sales Amount' },
    { id: 'TotalVisaSalesAmount', title: 'Total Visa Sales Amount' },
    { id: 'TotalDinersSalesAmount', title: 'Total Diners Sales Amount' },
    { id: 'TotalJCBSalesAmount', title: 'Total JCB Sales Amount' },
    { id: 'TotalCreditCardSalesAmount', title: 'Total Credit Card Sales Amount' },
    { id: 'TerminalNumber', title: 'Terminal Number' },
    { id: 'SMPOSSerialNumber', title: 'SMPOS Serial Number' },
].map(header => header.title); // Extracting titles from objects

const generateFileName = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero
    const year = date.getFullYear();
    return `${month}_${year}.csv`;
  };

ipcMain.handle(SqlChannel.getSIA, async (_event: any, path: string, query: string): Promise<Response> => {
    try {
        const response = await recordByQuery(query); // returns an array of data in JSON like in the csvHeaders
         // Check if the response contains data
         if (!response.List) {
            return { IsSomething: false, Message: response.Message };
        }
        // Generate file name and full path
        const fileName = generateFileName();
        const filePath = paths.join(path, fileName);

        // Check if file exists, and delete if it does
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Transform sampleData to array of arrays
        const csvData = response.List.map(item => [
            item.OrderNumber,
            item.BusinessDay,
            item.CheckOpen,
            item.CheckClose,
            item.TransactionType,
            item.Void,
            item.VoidAmount,
            item.Refund,
            item.RefundAmount,
            item.GuestCountSenior,
            item.GuestCountPWD,
            item.GrossSalesAmount,
            item.NetSalesAmount,
            item.TotalTax,
            item.OtherLocalTax,
            item.TotalServiceCharge,
            item.TotalTip,
            item.TotalDiscount,
            item.LessTaxAmount,
            item.EmployeeDiscountAmount,
            item.VIPDiscountAmount,
            item.DiscountField1Name,
            item.DiscountField2Name,
            item.DiscountField3Name,
            item.DiscountField4Name,
            item.DiscountField5Name,
            item.DiscountField6Name,
            item.DiscountField1Amount,
            item.DiscountField2Amount,
            item.DiscountField3Amount,
            item.DiscountField4Amount,
            item.DiscountField5Amount,
            item.DiscountField6Amount,
            item.TotalCashSalesAmount,
            item.TotalGiftCertificateSalesAmount,
            item.TotalEwalletOnlineSalesAmount,
            item.TotalMastercardSalesAmount,
            item.TotalVisaSalesAmount,
            item.TotalDinersSalesAmount,
            item.TotalJCBSalesAmount,
            item.TotalCreditCardSalesAmount,
            item.TerminalNumber,
            item.SMPOSSerialNumber,
        ]);

        // Create CSV writer instance with specified path and headers
        const csvWriter = createArrayCsvWriter({
            path: filePath,
            header: csvHeaders,
        });
         
        // Write records to CSV file
        await csvWriter.writeRecords(csvData);
        return { IsSomething: true, Message: Success.s00x00 };
    } catch (error: any) {
        return { IsSomething: false, Message: Error.e00x02 };
    }
});
