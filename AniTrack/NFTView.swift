// doesn't work, need to be fixed ASAP
import SwiftUI

struct NFTView: View {
    @ObservedObject var viewModel: CryptoViewModel
    
    var body: some View {
        List {
            ForEach(viewModel.nfts) { nft in
                NFTRow(nft: nft)
            }
        }
        .navigationTitle("NFTs")
        .onAppear {
            viewModel.fetchNFTs()
        }
    }
}

struct NFTRow: View {
    let nft: NFT
    
    var body: some View {
        HStack {
            AsyncImage(url: URL(string: nft.image)) { image in
                image.resizable()
            } placeholder: {
                ProgressView()
            }
            .frame(width: 40, height: 40)
            
            VStack(alignment: .leading) {
                Text(nft.name)
                    .font(.headline)
                Text(nft.collection)
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            VStack(alignment: .trailing) {
                Text("Floor: $\(nft.floor_price, specifier: "%.2f")")
                    .font(.headline)
                
                Text(String(format: "%.1f%%", nft.price_change_24h))
                    .font(.caption)
                    .foregroundColor(nft.price_change_24h >= 0 ? .green : .red)
            }
        }
        .padding(.vertical, 8)
    }
}
