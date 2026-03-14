import { getSettings } from '@shared/selectors'
import { SFC, SqlChannel } from '@shared/types'
import { convertDate, formatDates, formatNumber } from '@shared/utils'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getTenant } from '../../selectors'
import * as S from './Styles'

interface ZReadingProps {
  CurrentDate: string
}

export const ZReading: SFC<ZReadingProps> = ({ className, CurrentDate }) => {
  const ZreadingDetails = useSelector(getSettings)
  const Terminal = useSelector(getTenant)?.Terminal ?? 0
  const Dates = formatDates(new Date(CurrentDate ?? new Date())).toString()
  const [paytypes, setPaytypes] = useState<any[]>([])
  const [collectionNumber, setCollectionNumber] = useState<any>({})
  const [CancelledTx, setCancelledTx] = useState<any>({})
  const [VATAnalysis, setVATAnalysis] = useState<any>({})
  const [trx, setTrx] = useState<any>({})
  const [gross, setGross] = useState<any>({})
  const [previousReading, setPreviousReading] = useState<any>({})
  const [discounts, setDiscounts] = useState<any[]>([])
  const [controlNumber, setControlNumber] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await window.electron.sql.get(SqlChannel.getZReadingData, Terminal, Dates)
      if (response.IsSomething && response.Data) {
        setPaytypes(response.Data.paytypes || [])
        setControlNumber(response.Data.controlNumber || {})
        setDiscounts(response.Data.discounts || [])
        setPreviousReading(response.Data.previousReading || {})
        setTrx(response.Data.trx || {})
        setGross(response.Data.gross || {})
        setVATAnalysis(response.Data.VATAnalysis || {})
        setCancelledTx(response.Data.CancelledTx || {})
        setCollectionNumber(response.Data.collectionNumber || {})
      }
    }

    fetchData()
  }, [CurrentDate, Terminal])

  //console.log(discounts)
  const totalCollection =
    paytypes.length > 0
      ? paytypes.reduce((total, paytype) => total + (paytype?.TotalAmount ?? 0), 0)
      : 0

  const regularDiscounts =
    discounts.length > 0
      ? discounts.reduce((total, discount) => total + (discount?.NonGovDiscountAmount ?? 0), 0)
      : 0
  const GovDiscountAmount =
    discounts.length > 0
      ? discounts.reduce((total, discount) => total + (discount?.GovDiscountAmount ?? 0), 0)
      : 0
  const GrossSalesAmount =
    Number(Math.round((gross?.NetSales ?? 0) * 100) / 100) +
    Number(regularDiscounts) +
    Number(GovDiscountAmount)
  //console.log(discounts)

  return (
    <>
      <S.Container className={`text-bold ${className}`}>
        <S.Div className="mb-3">
          <h4 className="mb-1 text-black"> {ZreadingDetails.Name ?? 'NA'}</h4>
          <S.TextSmall> {ZreadingDetails.Address ?? 'NA'}</S.TextSmall>
          <S.TextSmall> Operator {ZreadingDetails.Operator ?? 'NA'}</S.TextSmall>
        </S.Div>
        <S.Div className="mb-3">
          <S.TextNormal> Permit: {ZreadingDetails.PermitNumber ?? 'NA'}</S.TextNormal>
          <S.TextNormal> TIN: {ZreadingDetails.TIN ?? 'NA'}</S.TextNormal>
          <S.TextNormal> Accrdt: {ZreadingDetails.AccreditationNumber ?? 'NA'}</S.TextNormal>
          <S.TextNormal> Serial: {ZreadingDetails.SerialNumber ?? 'NA'}</S.TextNormal>
          <S.TextNormal> Mahcine: {ZreadingDetails.MachineNumber ?? 'NA'}</S.TextNormal>
        </S.Div>
        <S.Div className="mb-1">
          <S.TextNormal style={{ fontWeight: 'bold' }}>Z Reading Report</S.TextNormal>
          <S.TextNormal>{convertDate(CurrentDate)}</S.TextNormal>
        </S.Div>
        <S.DivBorderTop>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Gross Sales:</S.TextNormal>
            <S.TextNormal>
              {formatNumber(Number(Math.round((GrossSalesAmount ?? 0) * 100) / 100))}
            </S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              Regular Discount:
            </S.TextNormal>
            <S.TextNormal> {formatNumber(Number(regularDiscounts))}</S.TextNormal>
          </S.DivBetween>
          {discounts.length > 0 &&
            discounts.map(
              (discount, index) =>
                discount.IsGovernmentMandated && (
                  <S.Div key={index}>
                    <S.DivBetween>
                      <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
                        {discount?.Discount ?? 'NA'}:
                      </S.TextNormal>
                      <S.TextNormal>
                        {formatNumber(Number(discount?.GovDiscountAmount ?? 0))}
                      </S.TextNormal>
                    </S.DivBetween>
                    <S.DivBetween>
                      <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
                        Less:
                      </S.TextNormal>
                      <S.TextNormal>{formatNumber(Number(discount?.VATExempt ?? 0))}</S.TextNormal>
                    </S.DivBetween>
                  </S.Div>
                )
            )}
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Net Sales:</S.TextNormal>
            <S.TextNormal>
              {formatNumber(Number(Math.round((gross?.NetSales ?? 0) * 100) / 100))}
            </S.TextNormal>
          </S.DivBetween>
        </S.DivBorderTop>

        <S.DivBorderTop>
          {paytypes.length > 0 &&
            paytypes.map((paytype, index) => (
              <S.DivBetween key={index}>
                <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
                  {paytype.PayType}:
                </S.TextNormal>
                <S.TextNormal>
                  {formatNumber(Number(Math.round((paytype?.TotalAmount ?? 0) * 100) / 100))}
                </S.TextNormal>
              </S.DivBetween>
            ))}
        </S.DivBorderTop>
        <S.DivBorderTop>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              Total Collection:
            </S.TextNormal>
            <S.TextNormal> {formatNumber(totalCollection)}</S.TextNormal>
          </S.DivBetween>
        </S.DivBorderTop>
        <S.DivBorderTop>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>AR:</S.TextNormal>
            <S.TextNormal> 0.00</S.TextNormal>
          </S.DivBetween>
        </S.DivBorderTop>
        <S.DivBorderTop>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              Service Charge:
            </S.TextNormal>
            <S.TextNormal> {formatNumber(VATAnalysis?.NONVat ?? 0)}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>VAT Sales:</S.TextNormal>
            <S.TextNormal>{formatNumber(VATAnalysis?.VATSales ?? 0)}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              VAT Exempt Sales:
            </S.TextNormal>
            <S.TextNormal> {formatNumber(VATAnalysis?.VATExempt ?? 0)}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              Zero Rated Sales:
            </S.TextNormal>
            <S.TextNormal> {formatNumber(VATAnalysis?.zerosale ?? 0)}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>VAT Amount:</S.TextNormal>
            <S.TextNormal> {formatNumber(VATAnalysis?.VATAmount ?? 0)}</S.TextNormal>
          </S.DivBetween>
        </S.DivBorderTop>
        <S.DivBorderTop>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Counter Start:</S.TextNormal>
            <S.TextNormal> {collectionNumber.CounterStart}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Counter End:</S.TextNormal>
            <S.TextNormal> {collectionNumber.CounterEnd}</S.TextNormal>
          </S.DivBetween>
        </S.DivBorderTop>
        <S.DivBorderTop>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Cancelled Tx:</S.TextNormal>
            <S.TextNormal> {CancelledTx.CancelledTx ?? 0}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              Cancelled Amount:
            </S.TextNormal>
            <S.TextNormal> {formatNumber(CancelledTx.CancelledAmount ?? 0)}</S.TextNormal>
          </S.DivBetween>
        </S.DivBorderTop>
        <S.DivBorderTop>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              No. of Transactions:
            </S.TextNormal>
            <S.TextNormal> {trx?.TotalTrx ?? 0}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Number of SKU:</S.TextNormal>
            <S.TextNormal> {trx?.TotalSKU ?? 0}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              Total Quantity:
            </S.TextNormal>
            <S.TextNormal> {formatNumber(Number(trx?.TotalQuantity ?? 0))}</S.TextNormal>
          </S.DivBetween>
        </S.DivBorderTop>

        <S.DivBorderTop>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Z-Counter:</S.TextNormal>
            <S.TextNormal> {Number(controlNumber?.ControlNumber ?? 0)}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>
              Previous Reading:
            </S.TextNormal>
            <S.TextNormal> {formatNumber(previousReading?.PreviousReading ?? 0)}</S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Net Sales:</S.TextNormal>
            <S.TextNormal>
              {formatNumber(Number(Math.round((gross?.NetSales ?? 0) * 100) / 100))}
            </S.TextNormal>
          </S.DivBetween>
          <S.DivBetween>
            <S.TextNormal style={{ textAlign: 'end', padding: '2px' }}>Running Total:</S.TextNormal>
            <S.TextNormal>
              {formatNumber(
                (previousReading?.PreviousReading ?? 0) +
                  Number(Math.round((gross?.NetSales ?? 0) * 100) / 100)
              )}
            </S.TextNormal>
          </S.DivBetween>
        </S.DivBorderTop>
        <S.DivBorderTop>
          <S.TextNormal style={{ fontWeight: 'bold' }}>Z Reading End</S.TextNormal>
        </S.DivBorderTop>
      </S.Container>
    </>
  )
}
