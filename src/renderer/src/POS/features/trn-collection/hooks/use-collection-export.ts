import { ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'

export const useCollectionExport = () => {
  const exportToPDF = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId)
    if (!element) {
      displayToast('Export failed: Content not found', ToastType.error)
      return
    }

    const opt = {
      margin: 1,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    }

    html2pdf().from(element).set(opt).save()
  }

  const exportToCSV = (data: any, filename: string) => {
    if (!data?.collectionLines) return

    const headers = ['Collection #', 'Date', 'Customer', 'Pay Type', 'Amount', 'OR #']
    const rows = data.collectionLines.map((line: any) => [
      data.collectionNumber,
      new Date(data.collectionDate).toLocaleDateString(),
      data.customer?.name || 'N/A',
      line.payType?.name || 'Unknown',
      line.amount,
      data.manualORNumber
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
    if (!data?.collectionLines) return

    try {
      const worksheetData = data.collectionLines.map((line: any) => ({
        'Collection #': data.collectionNumber,
        Date: new Date(data.collectionDate).toLocaleDateString(),
        Customer: data.customer?.name || 'N/A',
        'Pay Type': line.payType?.name || 'Unknown',
        Amount: Number(line.amount).toFixed(2),
        'OR #': data.manualORNumber
      }))

      const ws = XLSX.utils.json_to_sheet(worksheetData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Collection')
      XLSX.writeFile(wb, `${filename}.xlsx`)

      displayToast('Excel Exported successfully', ToastType.success)
    } catch (error) {
      console.error('XLSX Export failed:', error)
      displayToast('XLSX export failed. Ensure "xlsx" library is installed.', ToastType.error)
    }
  }

  return {
    exportToPDF,
    exportToCSV,
    exportToXLSX
  }
}

