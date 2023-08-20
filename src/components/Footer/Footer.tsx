
import React from 'react'
import Linked from '../Icons/Linked'
import Facebook from '../Icons/Facebook'
import Instagram from '../Icons/Instagram'
import Email from '../Icons/Email'

export default function Footer() {
  return (
        <footer
          style={{
            
            width: "100%",
            backgroundColor: "#192435",
            height: "75px",
            marginTop: "20px",
            paddingTop: "10px",
          }}
        >
          <div
            style={{
              gap: "20px",
              paddingTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <a href="https://www.facebook.com/aleksyyyyy/">
                <Facebook />
              </a>
            </div>
            <div>
              <a href="https://www.linkedin.com/in/aleksy-undefined-90b128268/">
                <Linked />
              </a>
            </div>
            <div>
              <a href="https://www.instagram.com/aleksylisowski/">
                <Instagram />
              </a>
            </div>
            <div>
              <a href="mailto:aleksylisowski@gmail.com">
                <Email />
              </a>
            </div>
          </div>
          <div style={{ color: "gray", fontSize: "0.6rem" }}>
            Created By Aleksy Lisowski & Filip Porębski
          </div>
        </footer>
         )
        }
