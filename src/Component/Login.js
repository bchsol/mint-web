import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import * as s from "../Style/globalStyles";

function Login() {
  const [account, setAccount] = useState();
  const [walletType, setWalletType] = useState("");
  let accounts;

  const connectWallet = async () => {
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    setWalletType("eth");
    window.sessionStorage.setItem("isLogin", true);
    window.location = "/mint-web/profile";
  };
  const connectKaikas = async () => {
    accounts = await window.klaytn.enable();
    setAccount(accounts[0]);
    setWalletType("klay");
    window.sessionStorage.setItem("isLogin", true);
    window.location = "/mint-web/profile";
  };

  return (
    <s.Screen>
      <s.Container ai={"center"} style={{ marginTop: "25vmin" }}>
        <ul
          style={{
            listStyle: "none",
            border: "1px solid rgb(229,232,235)",
            borderRadius: "10px",
            paddingLeft: 0,
          }}
        >
          <li>
            <Button
              variant="outline-dark"
              style={{
                fontWeight: "bold",
                width: "100%",
                padding: "15px",
                border: "none",
                borderBottom: "1px solid rgb(229,232,235)",
                display: "inline-flex",
                alignItems: "center",
              }}
              onClick={() => connectWallet()}
            >
              <div>
                <img
                  src="./images/metaMask.png"
                  style={{
                    objectFit: "contain",
                    width: 50,
                    height: 50,
                    marginRight: 16,
                  }}
                />
              </div>
              <span>Metamask</span>
            </Button>
          </li>
          <li>
            <Button
              style={{
                fontWeight: "bold",
                width: "100%",
                padding: "15px",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
              variant="outline-dark"
              onClick={() => connectKaikas()}
            >
              <div>
                <img
                  src="./images/kaikas.png"
                  style={{
                    objectFit: "contain",
                    width: 50,
                    height: 50,
                    marginRight: 16,
                  }}
                />
              </div>
              <span>Kaikas</span>
            </Button>
          </li>
        </ul>
      </s.Container>
    </s.Screen>
  );
}
export default Login;
