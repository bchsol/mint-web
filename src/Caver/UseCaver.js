import Caver from "caver-js";
import axios from "axios";
import ContractData from "../Contract/Contract";

const caver = new Caver(window.klaytn);
const NFTContract = new caver.contract(
  ContractData.Abi,
  ContractData.AddressBaobab
);

export const fetchNfts = async (address) => {
  const balance = await NFTContract.methods.balanceOf(address).call();
  //console.log(`[NFT Balance]${balance}`);

  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
    tokenIds.push(id);
  }

  const tokenUris = [];
  const tokenNames = [];
  for (let i = 0; i < balance; i++) {
    const metadataUrl = await NFTContract.methods.tokenURI(tokenIds[i]).call();
    const response = await axios.get(
      "https://ipfs.io/ipfs/" + metadataUrl.substring(7)
    );
    const uriJSON = response.data;
    tokenUris.push("https://ipfs.io/ipfs/" + uriJSON.image.substring(7));
    tokenNames.push(uriJSON.name);
  }

  const nfts = [];
  for (let i = 0; i < balance; i++) {
    nfts.push({ name: tokenNames[i], uri: tokenUris[i], id: tokenIds[i] });
  }
  //console.log(nfts);
  return nfts;
};

export const getBalance = async (address) => {
  const response = await caver.klay.getBalance(address);
  const balance = caver.utils.convertFromPeb(response);
  console.log(balance);
  return balance;
};
