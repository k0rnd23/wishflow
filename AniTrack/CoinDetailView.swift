import SwiftUI

struct CoinDetailView: View {
    @ObservedObject var viewModel: CryptoViewModel
    let coin: Coin
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                HStack {
                    AsyncImage(url: URL(string: coin.image)) { image in
                        image.resizable()
                    } placeholder: {
                        ProgressView()
                    }
                    .frame(width: 60, height: 60)
                    
                    VStack(alignment: .leading) {
                        Text(coin.name)
                            .font(.title)
                        Text(coin.symbol.uppercased())
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing) {
                        Text("$\(coin.current_price, specifier: "%.2f")")
                            .font(.title2)
                        Text(String(format: "%.1f%%", coin.price_change_percentage_24h))
                            .font(.subheadline)
                            .foregroundColor(coin.price_change_percentage_24h >= 0 ? .green : .red)
                    }
                }
                
                SparklineView(data: coin.sparkline_in_7d?.price ?? [])
                    .frame(height: 200)
                    .padding(.vertical)
                
                CurrencyConverter(viewModel: viewModel, coin: coin)
                    .padding()
                
                VStack(alignment: .leading, spacing: 10) {
                    InfoRow(title: "Капитализация", value: "$\(formatNumber(coin.market_cap))")
                    InfoRow(title: "Объем (24ч)", value: "$\(formatNumber(coin.total_volume))")
                    InfoRow(title: "В обороте (кол-во коинов)", value: formatNumber(coin.circulating_supply))
                }
            }
            .padding()
        }
        .navigationTitle(coin.name)
    }
    
    func formatNumber(_ number: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: number)) ?? ""
    }
}

struct InfoRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .foregroundColor(.gray)
            Spacer()
            Text(value)
                .fontWeight(.semibold)
        }
    }
}

struct CurrencyConverter: View {
    @ObservedObject var viewModel: CryptoViewModel
    let coin: Coin
    @State private var amount: String = ""
    @State private var convertedAmount: Double?

    var body: some View {
        VStack {
            HStack {
                TextField("Количество", text: $amount)
                    .keyboardType(.decimalPad)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                Text(coin.symbol.uppercased())
            }
            .padding()

            Picker("Валюта", selection: $viewModel.selectedCurrency) {
                ForEach(Currency.allCases, id: \.self) { currency in
                    Text(currency.rawValue).tag(currency)
                }
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()

            Button("Конвертировать") {
                if let amountValue = Double(amount) {
                    convertedAmount = viewModel.convert(amountValue, from: coin, to: viewModel.selectedCurrency)
                }
            }
            .padding()

            if let convertedAmount = convertedAmount {
                Text("\(convertedAmount, specifier: "%.2f") \(viewModel.selectedCurrency.rawValue)")
                    .font(.headline)
                    .padding()
            }
        }
    }
}
