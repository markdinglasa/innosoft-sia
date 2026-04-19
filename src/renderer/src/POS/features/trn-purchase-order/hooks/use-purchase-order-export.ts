import { ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'

export const usePurchaseOrderExport = () => {
  const exportToPDF = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId)
    if (!element) {
      displayToast('Export failed: Content not found', ToastType.error)
      return
    }

    const opt = {
      margin: 0.5,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    }

    html2pdf().from(element).set(opt).save()
  }

  const exportToCSV = (data: any, filename: string) => {
    if (!data?.lineItems) return

    const headers = ['PO #', 'Date', 'Supplier', 'Item', 'Quantity', 'Unit', 'Cost', 'Amount']
    const rows = data.lineItems.map((line: any) => [
      data.purchaseOrderNumber,
      new Date(data.purchaseOrderDate).toLocaleDateString(),
      data.supplier?.name || 'N/A',
      line.item?.name || line.description || 'Unknown',
      line.quantity,
      line.unit?.name || 'Unit',
      line.unitCost,
      line.totalCost
    ])

    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    link.remove()

    displayToast('CSV Exported successfully', ToastType.success)
  }

  const exportToXLSX = (data: any, filename: string) => {
    if (!data?.lineItems) return

    try {
      const worksheetData = data.lineItems.map((line: any) => ({
        'PO #': data.purchaseOrderNumber,
        Date: new Date(data.purchaseOrderDate).toLocaleDateString(),
        Supplier: data.supplier?.name || 'N/A',
        Item: line.item?.name || line.description || 'Unknown',
        Quantity: line.quantity,
        Unit: line.unit?.name || 'Unit',
        Cost: Number(line.unitCost).toFixed(2),
        Amount: Number(line.totalCost).toFixed(2)
      }))

      const ws = XLSX.utils.json_to_sheet(worksheetData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Purchase Order')
      XLSX.writeFile(wb, `${filename}.xlsx`)

      displayToast('Excel Exported successfully', ToastType.success)
    } catch (error) {
      console.error('XLSX Export failed:', error)
      displayToast('XLSX export failed.', ToastType.error)
    }
  }

  return {
    exportToPDF,
    exportToCSV,
    exportToXLSX
  }
}

