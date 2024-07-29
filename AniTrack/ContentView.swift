import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = CryptoViewModel()
    
    var body: some View {
        TabView {
            NavigationView {
                CoinListView(viewModel: viewModel)
            }
            .tabItem {
                Label("Коины", systemImage: "dollarsign.circle")
            }
            
            NavigationView {
                NFTView(viewModel: viewModel)
            }
            .tabItem {
                Label("NFTs", systemImage: "paintpalette")
            }
            
            NavigationView {
                ExchangeView(viewModel: viewModel)
            }
            .tabItem {
                Label("Обменники", systemImage: "building.columns")
            }
        }
        .preferredColorScheme(viewModel.isDarkMode ? .dark : .light)
        .onAppear {
            viewModel.fetchExchangeRates()
        }
    }
}

struct CoinListView: View {
    @ObservedObject var viewModel: CryptoViewModel
    
    var body: some View {
        ZStack {
            Color(viewModel.isDarkMode ? .black : .white)
                .edgesIgnoringSafeArea(.all)
            
            VStack {
                SearchBar(text: $viewModel.searchText)
                
                List {
                    ForEach(viewModel.coins.filter {
                        viewModel.searchText.isEmpty ? true : $0.name.lowercased().contains(viewModel.searchText.lowercased())
                    }) { coin in
                        CoinRow(coin: coin)
                            .onTapGesture {
                                viewModel.selectedCoin = coin
                            }
                    }
                }
                .listStyle(PlainListStyle())
            }
        }
        .navigationTitle("AniTrack")
        .toolbar {
            Button(action: {
                viewModel.isDarkMode.toggle()
            }) {
                Image(systemName: viewModel.isDarkMode ? "sun.max.fill" : "moon.fill")
            }
        }
        .sheet(item: $viewModel.selectedCoin) { coin in
            CoinDetailView(viewModel: viewModel, coin: coin)
        }
    }
}

struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
            TextField("Поиск", text: $text)
                .textFieldStyle(RoundedBorderTextFieldStyle())
        }
        .padding()
    }
}

struct CoinRow: View {
    let coin: Coin
    
    var body: some View {
        HStack {
            AsyncImage(url: URL(string: coin.image)) { image in
                image.resizable()
            } placeholder: {
                ProgressView()
            }
            .frame(width: 40, height: 40)
            
            VStack(alignment: .leading) {
                Text(coin.name)
                    .font(.headline)
                Text(coin.symbol.uppercased())
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            VStack(alignment: .trailing) {
                Text("$\(coin.current_price, specifier: "%.2f")")
                    .font(.headline)
                
                SparklineView(data: coin.sparkline_in_7d?.price ?? [])
                    .frame(width: 100, height: 30)
                
                Text(String(format: "%.1f%%", coin.price_change_percentage_24h))
                    .font(.caption)
                    .foregroundColor(coin.price_change_percentage_24h >= 0 ? .green : .red)
            }
        }
        .padding(.vertical, 8)
    }
}

struct SparklineView: View {
    let data: [Double]
    
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                for (index, value) in data.enumerated() {
                    let x = CGFloat(index) / CGFloat(data.count - 1) * geometry.size.width
                    let y = (1 - CGFloat((value - data.min()!) / (data.max()! - data.min()!))) * geometry.size.height
                    
                    if index == 0 {
                        path.move(to: CGPoint(x: x, y: y))
                    } else {
                        path.addLine(to: CGPoint(x: x, y: y))
                    }
                }
            }
            .stroke(Color.blue, lineWidth: 2)
        }
    }
}
