import SwiftUI

struct ExchangeView: View {
    @ObservedObject var viewModel: CryptoViewModel
    
    var body: some View {
        List {
            ForEach(viewModel.exchanges) { exchange in
                ExchangeRow(exchange: exchange)
            }
        }
        .navigationTitle("Обменники")
        .onAppear {
            viewModel.fetchExchanges()
        }
    }
}

struct ExchangeRow: View {
    let exchange: Exchange
    
    var body: some View {
        HStack {
            AsyncImage(url: URL(string: exchange.image)) { image in
                image.resizable()
            } placeholder: {
                ProgressView()
            }
            .frame(width: 40, height: 40)
            
            Text(exchange.name)
                .font(.headline)
            
            Spacer()
            
            VStack(alignment: .trailing) {
                Text("Volume: \(exchange.trade_volume_24h_btc, specifier: "%.2f") BTC")
                    .font(.subheadline)
                
                Text("Trust: \(exchange.trust_score)")
                    .font(.caption)
                    .foregroundColor(trustScoreColor(exchange.trust_score))
            }
        }
        .padding(.vertical, 8)
    }
    
    func trustScoreColor(_ score: Int) -> Color {
        switch score {
        case 9...10:
            return .green
        case 7...8:
            return .orange
        case 5...6:
            return .yellow
        default:
            return .red
        }
    }
}
