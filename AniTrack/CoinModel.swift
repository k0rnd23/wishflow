import Foundation

struct Coin: Identifiable, Codable {
    let id: String
    let symbol: String
    let name: String
    let image: String
    let current_price: Double
    let price_change_percentage_24h: Double
    let sparkline_in_7d: SparklineData?
    let market_cap: Double
    let total_volume: Double
    let circulating_supply: Double
}

struct SparklineData: Codable {
    let price: [Double]
}

struct NFT: Identifiable, Codable {
    let id: String
    let name: String
    let image: String
    let floor_price: Double
    let price_change_24h: Double
    let collection: String
}

struct Exchange: Identifiable, Codable {
    let id: String
    let name: String
    let image: String
    let trade_volume_24h_btc: Double
    let trust_score: Int
}

enum Currency: String, CaseIterable {
    case usd = "USD"
    case eur = "EUR"
    case rub = "RUB"
    case kzt = "KZT"
}

class CryptoViewModel: ObservableObject {
    @Published var coins: [Coin] = []
    @Published var nfts: [NFT] = []
    @Published var exchanges: [Exchange] = []
    @Published var searchText: String = ""
    @Published var isDarkMode: Bool = false
    @Published var selectedCoin: Coin?
    @Published var selectedCurrency: Currency = .usd
    @Published var exchangeRates: [Currency: Double] = [:]
    
    init() {
        fetchAllData()
    }
    
    func fetchAllData() {
        fetchCoins()
        fetchNFTs()
        fetchExchanges()
        fetchExchangeRates()
    }
    
    func fetchCoins() {
        guard let url = URL(string: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true") else { return }
        
        URLSession.shared.dataTask(with: url) { data, _, error in
            if let error = error {
                print("Error fetching coins: \(error)")
                return
            }
            
            guard let data = data else {
                print("No data received when fetching coins")
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode([Coin].self, from: data)
                DispatchQueue.main.async {
                    self.coins = decodedData
                }
            } catch {
                print("Error decoding coin JSON: \(error)")
            }
        }.resume()
    }
    
    func fetchNFTs() {
        guard let url = URL(string: "https://api.coingecko.com/api/v3/nfts/list?order=market_cap_desc&per_page=100&page=1") else { return }
        
        URLSession.shared.dataTask(with: url) { data, _, error in
            if let error = error {
                print("Error fetching NFTs: \(error)")
                return
            }
            
            guard let data = data else {
                print("No data received when fetching NFTs")
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode([NFT].self, from: data)
                DispatchQueue.main.async {
                    self.nfts = decodedData
                }
            } catch {
                print("Error decoding NFT JSON: \(error)")
            }
        }.resume()
    }
    
    func fetchExchanges() {
        guard let url = URL(string: "https://api.coingecko.com/api/v3/exchanges?order=volume_desc") else { return }
        
        URLSession.shared.dataTask(with: url) { data, _, error in
            if let error = error {
                print("Error fetching exchanges: \(error)")
                return
            }
            
            guard let data = data else {
                print("No data received when fetching exchanges")
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode([Exchange].self, from: data)
                DispatchQueue.main.async {
                    self.exchanges = decodedData
                }
            } catch {
                print("Error decoding Exchange JSON: \(error)")
            }
        }.resume()
    }
    
    func fetchExchangeRates() {
        guard let url = URL(string: "https://api.exchangerate-api.com/v4/latest/USD") else { return }
        
        URLSession.shared.dataTask(with: url) { data, _, error in
            if let data = data {
                do {
                    let ratesData = try JSONDecoder().decode(ExchangeRatesResponse.self, from: data)
                    DispatchQueue.main.async {
                        self.exchangeRates = [
                            .usd: 1.0,
                            .eur: ratesData.rates["EUR"] ?? 1.0,
                            .rub: ratesData.rates["RUB"] ?? 1.0,
                            .kzt: ratesData.rates["KZT"] ?? 1.0
                        ]
                    }
                } catch {
                    print("Error decoding exchange rates: \(error)")
                }
            }
        }.resume()
    }

    func convert(_ amount: Double, from coin: Coin, to currency: Currency) -> Double {
        let usdValue = amount * coin.current_price
        return usdValue * (exchangeRates[currency] ?? 1.0)
    }
}

struct ExchangeRatesResponse: Codable {
    let rates: [String: Double]
}
