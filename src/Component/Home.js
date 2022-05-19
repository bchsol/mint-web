import * as s from "../Style/globalStyles";

function Home() {
  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{
          backgroundImage: "url(images/homebg.jpg)",
          textAlign: "center",
        }}
      >
        <span
          className="Title"
          style={{ fontSize: 30, fontWeight: "bold", marginTop: "25vmin" }}
        >
          메인화면
        </span>
        <br />
        <div style={{ fontSize: 20 }}>
          <p>상단바의 mint버튼 : 민팅페이지로 넘어갑니다</p>
          <p>pofile버튼 : 지갑의 잔액과 가지고 있는 NFT를 볼 수있습니다.</p>
        </div>
      </s.Container>
    </s.Screen>
  );
}

export default Home;
