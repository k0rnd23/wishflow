interface PriceFormatterProps {
  amount: number
  currency?: string
  locale?: string
}

export function PriceFormatter({
  amount,
  currency = "KZT",
  locale = "en-US"
}: PriceFormatterProps) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return <span>{formatter.format(amount)}</span>
}