//    "prepublishOnly": "npm test && npm run lint",
//"preversion": "npm run lint",
//
import React from "react";
import { useEffect, useState} from "react";


const googleCardStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '319px',
    height: '45px',
    background: '#252525',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer'
} as React.CSSProperties;

const buttonTextSpan = {
    fontFamily: 'Chakra Petch',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '23px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFFFFF'
} as React.CSSProperties;

const grid = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
} as React.CSSProperties;

const container = {
    position: 'absolute',
    float: 'left',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transition: "opacity 400ms ease-in",
    borderRadius: 10,
    padding: 30,
    zIndex: 100,
    background: 'black'
} as React.CSSProperties;

const footer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '26.39px'
} as React.CSSProperties;

const footerNormalText = {
    fontFamily: 'Chakra Petch',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '14.109px',
    color: '#535353',
    lineGeight: '18px'
} as React.CSSProperties;

const footerBigText = {
    fontFamily: 'Chakra Petch',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '16.1351px',
    lineHeight: '21px',
    color: '#535353'
} as React.CSSProperties;

const Main = (props:any) => {
    
    const [show, setShow] = useState(true);
    
    useEffect(()=>{
        document.addEventListener(
            "show-glip-modal", (e:any) =>{
                setShow(true)
        });
        document.addEventListener(
            "hide-glip-modal", (e)=> {
                setShow(false)
        });
    }, []);
    
    const unloggedInView = (
        <div>
          <button onClick={() => {
              props.glipWallet.login("google", window.location.href)}}
                  style={googleCardStyle} >
            <img src={'https://live-nft-hosted-assets.s3.ap-south-1.amazonaws.com/google_logo.svg'}
                 style={{marginRight:14}} />
            <span style={buttonTextSpan}>Continue with Google</span>
          </button>
          {/* <button
              style={{marginTop:12}}
              onClick={()=>GlipAuthGlobal.login("twitch")}
              className={styles.twitch_card}>
              <img src={TwitchLogo}
              style={{marginRight:14}} />
              <span className={styles.button_text_span}>Continue with Twitch</span>
              </button> */}
        </div>  
    );

    if(!show){
        return (<></>)
    }
    
    const MainComp = ()=>(
        <><div style={grid}>
          {unloggedInView}
        </div></>
    );
    
    return (
        <div style={container}>
          <img src={'https://live-nft-hosted-assets.s3.ap-south-1.amazonaws.com/cancel_icon.svg'}
               style={{position:'absolute', right:18, cursor: 'pointer'}}
               onClick={()=>{setShow(false)}} />
          <div style={{
              display:'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
          }}>
            <h1 style={{
                fontFamily: 'Chakra Petch',
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: "28px",
                lineHeight: "110%",
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                color: "#FFFFFF",
                border: "1px solid #000000",
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}>
              Create a wallet <br/>
              to continue</h1>
          </div>
          <MainComp/>
          <div style={footer}>
            <span style={footerNormalText}>powered by</span>
            <img src={'https://live-nft-hosted-assets.s3.ap-south-1.amazonaws.com/glip_wallet_logo.svg'} style={{marginLeft:12, marginRight:6}} />
            <span style={footerBigText}>glipwallet</span>
          </div>
        </div>
    );
    
};

export default Main;
