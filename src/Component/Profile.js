import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { getBalance, fetchNfts } from "../Caver/UseCaver";
import * as s from "../Style/globalStyles";

function Profile() {
  const [myAddress, setMyAddress] = useState(
    window.sessionStorage.getItem("address") || ""
  );
  const [myBalance, setMyBalance] = useState(
    window.sessionStorage.getItem("balance") || "0"
  );
  const [connectButton, setConnectButton] = useState(
    window.sessionStorage.getItem("connectbtn") || "Connect Wallet"
  );
  const [nfts, setNfts] = useState([]);

  const fetchMyNfts = async () => {
    if (myAddress === "") {
      alert("No Address");
      return;
    }
    const _nfts = await fetchNfts(myAddress);
    setNfts(_nfts);
  };

  const connectWallet = async () => {
    if (myAddress === "") {
      const address = await window.klaytn.enable();
      window.sessionStorage.setItem("address", address);
      window.sessionStorage.setItem("connectbtn", address);
      setMyAddress(address);
      setConnectButton(address);
    }
    const _balance = await getBalance(myAddress);
    window.sessionStorage.setItem("balance", _balance);
    setMyBalance(_balance);
  };

  useEffect(() => {
    if (myAddress !== "") {
      fetchMyNfts();
    }
  }, [myAddress]);

  return (
    <s.Screen style={{ backgroundImage: "url(/images/profilebg.jpg)" }}>
      <s.Container
        className="container"
        style={{
          padding: "0 10px 50px",
          width: "100%",
        }}
      >
        <h1>My NFT</h1>
        <Button variant="outline-dark" onClick={() => connectWallet()}>
          <span>{connectButton}</span>
        </Button>
        <h3>Balance : {myBalance} KLAY</h3>
        <Row>
          {nfts.map((nft) => (
            <Col
              key={nft.id}
              style={{ marginRight: 0, paddingRight: 0 }}
              sm={2}
              xs={2}
            >
              <Card>
                <Card.Img src={nft.uri} />
              </Card>
              {nft.name}
            </Col>
          ))}
        </Row>

        <div className="explan" style={{ fontSize: 19, marginTop: 60 }}>
          <p>NFT의 정보를 확인할 수 있습니다.</p>
          <p>민팅 후 느리게 나올 수 있으니 잠시 기다리시면 됩니다.</p>
        </div>
      </s.Container>
    </s.Screen>
  );
}

export default Profile;
