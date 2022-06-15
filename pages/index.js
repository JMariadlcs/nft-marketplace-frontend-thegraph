import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis" // To get data from our DATABASE -> eg. show only active NFTs
import NFTBox from "../components/NFTBox" // Show NFT Image
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries" // TheGraph 
import { useQuery } from "@apollo/client"  // TheGraph 

export default function Home() {
    // We are indexing the events off-chain and then read them from data-base.
    // Setup a server to listen for these events to be fired and then add them to a database.

    // Is it decentralized?
    // TheGraph -> does this decentralized.
    // Moralis -> does this centralized. (like etherscan or opensea)

    // Get only ACTIVE NFTs from TheGraph query repsonse -> save tehm on 'listedNfts'
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS) // TheGraph 

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            console.log(nft)
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <div>
                                    <NFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
