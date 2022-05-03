import ContractData from "../Contract/Contract";
import React, { useEffect, useState } from "react";
import Caver from "caver-js";
import { Modal } from "react-bootstrap";
import * as s from "../Style/globalStyles";
import { ProgressBar, Button } from "react-bootstrap";

global.Buffer = global.Buffer || require("buffer").Buffer; //webpack5 error

let ContractAddress = ContractData.AddressBaobab; // Baobab Network
let ContractAbi = ContractData.Abi;

const feePayerPrivateKey =
  "0x1d0e21aa5a61aa4a2f7863a2bf0129946e50cdf1a64fbf6586ec35c0af44d81a";

function Mint() {
  const [address, setAddress] = useState(
    window.sessionStorage.getItem("address") || ""
  );
  const [connectButton, setConnectButton] = useState(
    window.sessionStorage.getItem("connectbtn") || "Connect Wallet"
  );
  const [mintAmount, setMintAmount] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);
  const [allowMint, setAllowMint] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalContent, setModalContent] = useState("");

  const minting_block = 0;

  let caver = new Caver(window.klaytn);
  let nftContract = new caver.contract.create(ContractAbi, ContractAddress);

  // klaytn present block number
  useEffect(() => {
    const block = setInterval(async () => {
      caver.rpc.klay
        .getBlockNumber()
        .then((res) => setBlockNumber(parseInt(res)));
    }, 100);

    return () => {
      clearInterval(block);
    };
  }, [caver.rpc.klay]);

  useEffect(() => {
    (async () => {
      let totalSupply = await nftContract.methods.totalSupply().call();
      //console.log("Total Supply: " + totalSupply);
      //console.log("Connected with contract");
      setTotalSupply(totalSupply);
    })();

    if (parseInt(blockNumber) >= minting_block) {
      setAllowMint(true);
    }
  }, [blockNumber, nftContract.methods]);

  const handleMint = async () => {
    if (window.klaytn.networkVersion === 8217) {
      alert("Baobab으로 변경해주세요");
      return;
    }
    const feePayer = caver.klay.accounts.wallet.add(feePayerPrivateKey);

    if (allowMint) {
      let price = await nftContract.methods.mintPrice().call();

      const { rawTransaction: senderRawTransaction } =
        await caver.klay.signTransaction({
          type: "FEE_DELEGATED_SMART_CONTRACT_EXECUTION",
          from: address,
          to: ContractAddress,
          data: nftContract.methods.mint(address, mintAmount).encodeABI(),
          value: caver.utils.toPeb(price * mintAmount, "KLAY"),
          gas: "300000",
        });

      caver.klay
        .sendTransaction({
          senderRawTransaction: senderRawTransaction,
          feePayer: feePayer.address,
        })
        .once("receipt", (receipt) => {
          console.log("receipt", receipt);
          setModalHeader("민팅 성공");
          setModalContent("지갑에서 NFT를 확인하세요!");
          setShowModal(true);
        })
        .once("error", (error) => {
          console.log("error", error);
          if (totalSupply === 40) {
            setModalHeader("민팅 마감");
            setModalContent("완판되었습니다!");
            setShowModal(true);
          } else {
            setModalHeader("민팅 실패");
            setModalContent("다시 시도해 주세요");
            setShowModal(true);
          }
        });
    }
  };

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  const connectWallet = async () => {
    if (window.klaytn) {
      if (window.klaytn.networkVersion === 1001) {
        const tempAccounts = await window.klaytn.enable();
        window.sessionStorage.setItem("address", tempAccounts[0]);
        window.sessionStorage.setItem("connectbtn", tempAccounts[0]);
        setAddress(tempAccounts[0]);
        setConnectButton(tempAccounts[0]);
      } else if (window.klaytn.networkVersion === 8217) {
        setModalHeader("Network Error");
        setModalContent("Change to Baobab");
        setShowModal(true);
      }

      console.log("Connected Kaikas");
    } else {
      setModalHeader("Not Kaikas");
      setModalContent("Please Install Kaikas");
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (window.klaytn?.selectedAddress) {
      return;
    } else {
      connectWallet();
    }
  }, []);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{
          backgroundImage: "url(/images/mintbg.jpg)",
          textAlign: "center",
        }}
      >
        <Modal
          size="sm"
          show={showModal}
          onHide={() => setShowModal(false)}
          aria-labelledby="modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="modal">{modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalContent}</Modal.Body>
        </Modal>
        <div
          className="mint-card"
          style={{ top: "20vmin", width: "50vmin", position: "absolute" }}
        >
          <div
            className="card-top"
            style={{
              paddingBottom: 24,
              borderBottom: "2px solid rgb(0,0,0)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              className="Title"
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 24,
              }}
            >
              NFT Mint
            </span>
            <Button variant="outline-dark" onClick={connectWallet}>
              <span>{connectButton}</span>
            </Button>
          </div>
          <div
            className="card-middle"
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              marginBottom: 24,
            }}
          >
            <div
              className="Block"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <div className="CurrentBlock">
                현재 블록
                <div>{blockNumber}</div>
              </div>

              <div className="MintBlock">
                민팅 블록
                <div>{minting_block}</div>
              </div>
            </div>
          </div>
          <ProgressBar
            label={`${totalSupply} / 40`}
            now={totalSupply}
            max={40}
          />

          <div
            className="card-bottom"
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
            }}
          >
            <div
              style={{
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  borderRadius: "30%",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "15px",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  boxShadow: "0px 4px 0px -2px rgba(250, 250, 250, 0.3)",
                }}
                onClick={handleDecrement}
              >
                -
              </button>
              <div style={{ padding: "0px 24px 0px 24px", fontSize: "16px" }}>
                {mintAmount}
              </div>
              <button
                style={{
                  borderRadius: "30%",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "15px",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  boxShadow: "0px 4px 0px -2px rgba(250, 250, 250, 0.3)",
                }}
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
            <Button size="sm" onClick={handleMint}>
              Mint
            </Button>
          </div>
          <div className="explan" style={{ fontSize: 19, marginTop: 60 }}>
            <p>이 민팅은 클레이튼 테스트넷인 바오밥으로 실행됩니다.</p>
            <p>4가지 색상의 커피빈이 나오며 my-nfts에서 확인할 수 있습니다.</p>
            <p>현재 수수료는 대납됩니다.</p>
          </div>
        </div>
      </s.Container>
    </s.Screen>
  );
}
export default Mint;
