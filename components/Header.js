// This file is the Header of the web

// This file is used to interact with web3uikit from moralis to interact with the front-end
// NOTICE: we are NOT USING MORALIS SERVER - just the tools

import { ConnectButton } from "web3uikit"
import Link from "next/link" // to navigate between pages

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl"> NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Home Page</a>
                </Link>
                <Link href="/sell-nft">
                    <a className="mr-4 p-6">Sell NFTs</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
