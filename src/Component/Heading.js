import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

function Heading() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          {/* <Navbar.Brand href="/home"></Navbar.Brand> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link
                to="/"
                style={{
                  color: "black",
                  textDecoration: "none",
                  marginRight: "25px",
                  fontSize: "20px",
                }}
              >
                Home
              </Link>
              <Link
                to="/mint"
                style={{
                  color: "black",
                  textDecoration: "none",
                  marginRight: "25px",
                  fontSize: "20px",
                }}
              >
                mint
              </Link>
              <Link
                to="/profile"
                style={{
                  color: "black",
                  textDecoration: "none",
                  marginRight: "25px",
                  fontSize: "20px",
                }}
              >
                profile
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Heading;
