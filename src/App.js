// import logo from './logo.svg';
import "./App.css";
import React, { useState } from "react";
import Web3 from "web3";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer } from 'react-toastify';


// 1. contract ABI + Addresses
const NftContractAddress = "0x4CFFcc6f8b5295Bc53cd5e93B94deaCD3b2b9360";
const TokencontractAddress = "0x885901781d79281662875B2d3E0e8F08daB46Afb";
const StakingContractAddress = "0x72364B03B6d77EF7f155578B57aBE8AeFCB698c6";

const NftABI = require("./ABI's/Nft");
const tokenABI = require("./ABI's/Token");
const stakingABI = require("./ABI's/Staking");


function App() {
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(""); // slice 
  const [account, setAccount] = useState(""); // [0]
  const [amount, setAmount] = useState(0);  
  const [maxQuantity, setMaxQuantity] = useState(0);
  // const [status, setStatus] = useState("");

  const [NftContractInstance, setNftContractInstance] = useState(null); // NFT contract instance
  const [TokenContractInstance, setTokenContractInstance] = useState(null); // Token contract instance
  const [StakingContractInstance, setStakingContractInstance] = useState(null); // Staking contract instance

  const connectWallet = async () => {
    if (connected === true) {
      // Alternate: if (connected)
      setWeb3(null);
      setConnected(false);
      setAddress("");

      setNftContractInstance(null);
      setTokenContractInstance(null);
      setStakingContractInstance(null);

      return;
    }

    // Check if Web3 has been injected by the browser (e.g. MetaMask)
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(async () => {
          setWeb3(web3);
          setConnected(true); // updated
          const accounts = await web3.eth.getAccounts();
          setAddress(accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));

          setAccount(accounts[0]);
          console.log("accounts: ", accounts);

          console.log("NFTABI: ", NftABI);
          console.log("NFTADRESS: ", NftContractAddress);

          setNftContractInstance(
            new web3.eth.Contract(NftABI, NftContractAddress)
          );
          setTokenContractInstance(
            new web3.eth.Contract(tokenABI, TokencontractAddress)
          );
          setStakingContractInstance(
            new web3.eth.Contract(stakingABI, StakingContractAddress)
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(parseInt(value));
  };

  const mintNft = async () => {
    if (connected && web3 && NftContractInstance) {

      // var maxQuantity = parseInt(document.querySelector(".nftid").getAttribute("dataid"))
      setMaxQuantity(parseInt(document.querySelector(".nftid").getAttribute("dataid")))
      // var amount = document.getElementById("amountInput").value;

      // const convertToWei = web3.utils.toWei(amount.toString(), 'ether');
      // console.log("convertToWei: ", convertToWei)

      console.log("maxQuantity: ", maxQuantity);
      console.log("amount: ", amount);
      const data = "0x00";
      // Call the mint function on the contract
      NftContractInstance.methods.mint(maxQuantity, amount, data).send({
        from: account,
      });

    }
  };



  // const mintNft = async () => {
  //   if (connected && web3 && NftContractInstance) {
  //     setMaxQuantity(parseInt(document.querySelector(".nftid").getAttribute("dataid")));
  //     const data = "0x00";
  
  //     try {
  //       const transactionPromise = NftContractInstance.methods.mint(maxQuantity, amount, data).send({ from: account });
  //       const result = await transactionPromise;
  //       const transactionHash = result.transactionHash;
  
  //       let receipt = await web3.eth.getTransactionReceipt(transactionHash);
  
  //       while (receipt === null) {
  //         toast.info("Transaction is pending...", { autoClose: false, position: toast.POSITION.TOP_CENTER });
  //         await new Promise(resolve => setTimeout(resolve, 5000));
  //         receipt = await web3.eth.getTransactionReceipt(transactionHash);
  //       }
  
  //       if (receipt.status) {
  //         toast.success(`Transaction successful!`, { autoClose: 3000 });
  //       } else {
  //         toast.error(`Transaction failed: ${receipt.status}`, { autoClose: false });
  //       }
  
  //     } catch (error) {
  //       toast.error(`Transaction failed: ${error.message}`, { autoClose: false });
  //       console.log('Transaction failed:', error);
  //     }
  //   }
  // };
  



  const stakeNft = async () => {
    if (connected && web3 && TokenContractInstance && StakingContractInstance) {
      const approved = true;

      // var maxQuantity = document.getElementById("stakeQuantityInput").value;
      // var maxQuantity = parseInt(document.querySelector(".nftid").getAttribute("dataid"))
      setMaxQuantity(parseInt(document.querySelector(".nftid").getAttribute("dataid")))

      console.log("maxQuantity: ", maxQuantity)
      // var amount = document.getElementById("stakeAmountInput").value;
      console.log("amount: ",amount)

      let result = await NftContractInstance.methods.setApprovalForAll(StakingContractAddress, approved).send({from: account}).then(() =>{
         StakingContractInstance.methods.stake(maxQuantity,amount ).send({
          from: account
        })
      })
    }
  };


  const unstakeNft = async () => {
    if (connected && web3 && TokenContractInstance && StakingContractInstance) {
      // const approved = true;

      // var maxQuantity = document.getElementById("unstakeQuantityInput").value;
      // var maxQuantity = parseInt(document.querySelector(".nftid").getAttribute("dataid"))
      setMaxQuantity(parseInt(document.querySelector(".nftid").getAttribute("dataid")))
      // var amount = document.getElementById("stakeAmountInput").value;

      // let result = await NftContractInstance.methods.setApprovalForAll(StakingContractAddress, approved).send({from: account}).then(() =>{
      //    StakingContractInstance.methods.stakeNFT(maxQuantity,amount ).send({
      //     from: account
      //   })
      // })

      StakingContractInstance.methods.withdraw(maxQuantity, amount).send({
        from: account,
      });
    }
  };

  const claimReward = async () => {
    if (connected && web3 && TokenContractInstance && StakingContractInstance) {
      // const approved = true;

      // var maxQuantity = document.getElementById("unstakeQuantityInput").value;
      // var maxQuantity = parseInt(document.querySelector(".nftid").getAttribute("dataid"))
      // var amount = document.getElementById("stakeAmountInput").value;

      // let result = await TokenContractInstance.methods.approve(StakingContractAddress, amount).send({from: account}).then(() =>{
      //    StakingContractInstance.methods.claimRewards().send({
      //     from: account
      //   })
      // })

      StakingContractInstance.methods.claimRewards().send({
        from: account,
      });
    }
  };

  return (
    <div className="App">
      <div className="main">
        {/* ***** Header Start ***** */}
        <header id="header">
          {/* Navbar */}
          <nav
            data-aos="zoom-out"
            data-aos-delay={800}
            className="navbar gameon-navbar navbar-expand"
          >
            <div className="container header">
              {/* Logo */}
              {/* <a className="navbar-brand" href="/">
          <img src="/img/logo/logo.png" alt="Brand Logo" />
        </a> */}
              <div className="ml-auto" />
              {/* Navbar Nav */}
              <ul className="navbar-nav items mx-auto">
                <li className="nav-item active">
                  <a href="/" className="nav-link active">
                    Home
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav items mx-auto">
                <li className="nav-item active">
                  <a href="#stake" className="nav-link active">
                    Stake
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav items mx-auto">
                <li className="nav-item active">
                  <a href="#referral" className="nav-link active">
                    Referral
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav items mx-auto">
                <li className="nav-item active">
                  <a href="#how_to" className="nav-link active">
                    How to
                  </a>
                </li>
              </ul>
              {/* Navbar Icons */}
              {/* Navbar Toggler */}
              <ul className="navbar-nav toggle">
                <li className="nav-item">
                  <a
                    href="#"
                    className="nav-link"
                    data-toggle="modal"
                    data-target="#menu"
                  >
                    <i className="icon-menu m-0" />
                  </a>
                </li>
              </ul>
              {/* Navbar Action Button */}
              <ul className="navbar-nav action">
                <li className="nav-item ml-2">
                  {/* <a href="#" className="btn ml-lg-auto btn-bordered-white" onClick={connectWallet}><i className="icon-wallet mr-md-2" />Wallet Connect</a> */}
                  <div >
                    {/* <ConnectWallet /> */}
                    <button onClick={connectWallet} className="btn btn-primary" >
                      {connected ? `Connected!: ${address}` : "Connect Wallet"}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        {/* ***** Header End ***** */}
        {/* ***** Hero Area Start ***** */}
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-12 col-md-6 col-lg-9 text-center">
                {/* Hero Content */}
                <div className="hero-content">
                  <div className="intro text-center mb-5">
                    {/* <h1 style={{ color: "white" }}>Nft Staking</h1> */}
                    {/* <h3 className="mt-4">Hello !! There</h3> */}
                    <h3 className="m-0" style={{ marginTop: "35px !important"  }}>
                    Step#01: Mint the Nft
                    </h3>
                  </div>
                  {/* Buttons */}
          <section  id="stake">
            {/* <h2>NFT Image</h2> */}
            <img src="https://i.seadn.io/gae/lfsRoFH_qS3BM5RAfaZiVjbs6mCOVV6OHDU7adN76u9xjV4N_QxSxNIBg8PkmXd8NxqdFRsjG5DyCDgR-WV6Uo1aXeIukdgNOKCP?auto=format&w=3840" alt="NFT 1" width="35%"></img>
            <p class="nftid" dataid="1">NFT ID: 1</p>

          </section>
                  <div className="button-group">
                    <div className="input-area d-flex flex-column flex-md-row mb-3 d-flex justify-content-center ">
                      <div className="input-text">
                        
                        {/* <input
                          className="text-center"
                          type="text"
                          placeholder={"NFT Id"}
                          id="quantityInput"
                        /> */}

                        {/* <br />
                        <br /> */}
                        {/* <input
                          className="text-center"
                          type="text"
                          placeholder={"Amount"}
                          id="amountInput"
                        /> */}
                        <input className="text-center" type="number" value={amount} onChange={handleAmountChange} />
                        {/* <a href="#">Max</a> */}
                      </div>
                      {/* <a href="#" className="btn input-btn mt-2 mt-md-0 ml-md-3">Approve</a> */}
                    </div>
                    {/* <div>Transaction status: {status}</div> */}
        {/* <div>
      ...
      <ToastContainer />
    </div> */}
                    <a
                      className="btn btn-bordered active smooth-anchor"
                      href=""
                      onClick={mintNft}
                    >
                      <i className="icon-rocket mr-2" />
                      Mint NFt
                    </a>
                   </div>

                  {/* <div className="input-area d-flex flex-column flex-md-row mb-3">
                <div className="input-text">
                  <input type="text" placeholder={10000} />
                  <a href="#">Max</a>
                </div>
                <a href="#" className="btn input-btn mt-2 mt-md-0 ml-md-3">Approve</a>
            </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

{/* 
        <section className="staking-area" id="stake">
            <h2>NFT Image</h2>
            <img src="https://i.seadn.io/gae/lfsRoFH_qS3BM5RAfaZiVjbs6mCOVV6OHDU7adN76u9xjV4N_QxSxNIBg8PkmXd8NxqdFRsjG5DyCDgR-WV6Uo1aXeIukdgNOKCP?auto=format&w=3840" alt="NFT 1" width="25%"></img>
            <p>NFT ID: 1</p>
          
        </section> */}

        {/* ***** Hero Area End ***** */}
        {/* ***** Staking Area Start ***** */}
        <section className="staking-area" id="stake">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-7  mx-auto">
              <div className="card no-hover staking-card single-staking" style={{marginTop: "130px"}}>

                  <h3 className="m-0">
                  Step#02: Stake, Withdraw and claimReward
                  </h3>

                  <div className="tab-content mt-md-3" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="tab-one"
                      role="tabpanel"
                      aria-labelledby="tab-one-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              {/* <li><strong>Your Staked Alexa:</strong> 250 Alexa</li>
                          <li><strong>Available Withdraw:</strong> 250 Alexa</li>
                          <li><strong>Available Balance:</strong> 250 Alexa</li> */}
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            {/* <span>24%</span>
                          <span>APY*</span> */}
                          </div>
                        </div>

                        <div className="input-box my-4">

                          <div className="input-area d-flex flex-column flex-md-row mb-3 d-flex justify-content-center">

                            <div className="input-text">
                              {/* <input type="text" placeholder={10000} /> */}

                              {/* <input
                                className="text-center"
                                type="text"
                                placeholder={"NFT Id"}
                                id="stakeQuantityInput"
                              /> */}


                              {/* <br />
                              <br /> */}

          <section  id="stake">
            {/* <h2>NFT Image</h2> */}
            <img src="https://i.seadn.io/gae/lfsRoFH_qS3BM5RAfaZiVjbs6mCOVV6OHDU7adN76u9xjV4N_QxSxNIBg8PkmXd8NxqdFRsjG5DyCDgR-WV6Uo1aXeIukdgNOKCP?auto=format&w=3840" alt="NFT 1" width="75%"></img>
            <p class="nftid" dataid="1">NFT ID: 1</p>

          </section>
                              {/* <input
                                className="text-center"
                                type="text"
                                placeholder={"Amount"}
                                id="stakeAmountInput"
                                style={{marginTop: "10px", width:"70%"}}/> */}
                                <input className="text-center" type="number" value={amount} onChange={handleAmountChange} style={{marginTop: "10px", width:"70%"}}/>
                              
                              </div>

  
                          </div>

                          <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                              onClick={stakeNft}
                            >
                              StakeNft
                            </a>

                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                              onClick={unstakeNft}
                            >
                              withdraw
                            </a>

                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                              onClick={claimReward}
                            >
                              ClaimReward
                            </a>

                            <div><br /></div>
                          <div className="input-area d-flex flex-column flex-md-row d-flex justify-content-center">

                            <div className="input-text">
                              {/* <input type="text" placeholder={10000} /> */}
                              {/* <input
                                className="text-center"
                                type="text"
                                placeholder={"NFT Id"}
                                id="unstakeQuantityInput"
                              /> */}
                              {/* <br />
                              <br /> */}
            {/* <section  id="stake"> */}
            {/* <h2>NFT Image</h2> */}
            {/* <img src="https://i.seadn.io/gae/lfsRoFH_qS3BM5RAfaZiVjbs6mCOVV6OHDU7adN76u9xjV4N_QxSxNIBg8PkmXd8NxqdFRsjG5DyCDgR-WV6Uo1aXeIukdgNOKCP?auto=format&w=3840" alt="NFT 1" width="75%"></img>
            <p class="nftid" dataid="1">NFT ID: 1</p>

          </section> */}
                              {/* <input
                                className="text-center"
                                type="text"
                                placeholder={"Amount"}
                                id="unstakeAmountInput"
                                style={{marginTop: "10px", width:"70%"}}/> */}
                            </div>
                            {/* <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a> */}
                          </div>
                          <div><br /></div>
                          {/* <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                              onClick={unstakeNft}
                            >
                              Withdraw
                            </a> */}
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-two"
                      role="tabpanel"
                      aria-labelledby="tab-two-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>48%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-three"
                      role="tabpanel"
                      aria-labelledby="tab-three-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>72%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-four"
                      role="tabpanel"
                      aria-labelledby="tab-four-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>120%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-five"
                      role="tabpanel"
                      aria-labelledby="tab-five-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>144%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-six"
                      role="tabpanel"
                      aria-labelledby="tab-six-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>150%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="input-box my-4">
              <div className="input-area d-flex flex-column flex-md-row mb-3">
                <div className="input-text">
                  <input type="text" placeholder={0.00} />
                  <a href="#">Max</a>
                </div>
                <a href="#" className="btn input-btn mt-2 mt-md-0 ml-md-3">Approve</a>
              </div>
              <div className="input-area d-flex flex-column flex-md-row">
                <div className="input-text">
                  <input type="text" placeholder={0.00} />
                  <a href="#">Max</a>
                </div>
                <a href="#" className="btn input-btn mt-2 mt-md-0 ml-md-3">Withdraw</a>
              </div>
            </div> */}
                  {/* <span>Early unstake fee : 25%</span>
            <span>Referral Commision upto 6%</span> */}
                </div>
              </div>
              {/* <div className="col-12 col-md-5"> */}
                {/* <div className="staking-items mt-4 mt-md-0"> */}
                  {/* Single Card */}
                  {/* <div className="card no-hover staking-card">
                    <h3 className="m-0">9,574,20.84 Alexa</h3>
                    <p>Total Staked Alexa</p>
                  </div> */}
                  {/* Single Card */}
                  {/* <div className="card no-hover staking-card my-4">
                    <h3 className="m-0">57000 Alexa</h3>
                    <p>Total Referral Commision</p>
                  </div> */}
                  {/* Single Card */}
                  {/* <div className="card no-hover staking-card">
                    <h3 className="m-0">6997</h3>
                    <p>Number of Stakers</p>
                  </div> */}
                {/* </div> */}
              {/* </div> */}
            </div>
          </div>
          </section>
          {/* ***** Staking Area End ***** */}
          {/* ***** Staking Area Start ***** */}
        <section className="staking-area" id="referral">
          <h2 style={{ textAlign: "center" }}>Referral Commision</h2>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-4">
                <div className="card no-hover staking-card">
                  <h3 className="m-0">Level 1 - (3%)</h3>
                  <p>200 Alexa</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card no-hover staking-card">
                  <h3 className="m-0">Level 2 - (2%)</h3>
                  <p>210 Alexa</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card no-hover staking-card">
                  <h3 className="m-0">Level 3 - (1%)</h3>
                  <p>210 Alexa</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ***** Staking Area End ***** */}
        {/* ***** Content Area Start ***** */}
        <section className="content-area" id="how_to">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-md-6">
                <div className="content intro">
                  <span className="intro-text">staking</span>
                  <h2>How to Stake ?</h2>
                  <p>
                    Staking is a popular way to earn passive income with your
                    crypto investments
                  </p>
                  <ul className="list-unstyled items mt-5">
                    <li className="item">
                      {/* Content List */}
                      <div className="content-list d-flex align-items-center">
                        <div className="content-icon">
                          <span>
                            <i className="fa-brands fa-discord" />
                          </span>
                        </div>
                        <div className="content-body ml-4">
                          <h3 className="m-0">Add Alexa Tokens</h3>
                          <p className="mt-3">
                            You will need Alexa tokens in your wallet to stake.
                            Once you purchase Alexa tokens, make sure that you
                            add the Alexa token to your MetaMask/TrustWallet
                            Wallet so you can view your Alexa balance.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="item">
                      {/* Content List */}
                      <div className="content-list d-flex align-items-center">
                        <div className="content-icon">
                          <span className="featured">
                            <i className="fa-brands fa-hotjar" />
                          </span>
                        </div>
                        <div className="content-body ml-4">
                          <h3 className="m-0">Connect &amp; Verify Wallet</h3>
                          <p className="mt-3">
                            Click the "Connect Wallet" button at the upper right
                            corner of the site and make sure you have the
                            Binance Smart Chain network selected in your
                            MetaMask wallet.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="item">
                      {/* Content List */}
                      <div className="content-list d-flex align-items-center">
                        <div className="content-icon">
                          <span>
                            <i className="fa-solid fa-rocket" />
                          </span>
                        </div>
                        <div className="content-body ml-4">
                          <h3 className="m-0">Stake Alexa</h3>
                          <p className="mt-3">
                            You'll need to click the 'Stake Alexa' and scroll to
                            the top of the page to bring up the staking
                            interface on the site.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-md-6">
                {/* Blockchain Animation */}
                <div className="wrapper-animation d-none d-md-block">
                  <div className="blockchain-wrapper">
                    <div className="pyramid">
                      <div className="square">
                        <div className="triangle" />
                        <div className="triangle" />
                        <div className="triangle" />
                        <div className="triangle" />
                      </div>
                    </div>
                    <div className="pyramid inverse">
                      <div className="square">
                        <div className="triangle" />
                        <div className="triangle" />
                        <div className="triangle" />
                        <div className="triangle" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ***** Content Arumbea End ***** */}
        {/* ***** CTA Area Start ***** */}
        <section className="cta-area p-0">
          <div className="container">
            <div className="row">
              <div className="col-12 card">
                <div className="row align-items-center justify-content-center">
                  <div className="col-12 col-md-5 text-center">
                    <img src="/img/content/cta_thumb.png" alt="thumb" />
                  </div>
                  <div className="col-12 col-md-6 mt-4 mt-md-0">
                    <h2 className="m-0">BUY $Alexa NOW</h2>
                    <br />
                    <p>
                      Still don’t have $Alexa token? Buy it now on PancakeSwap
                      and start staking your tokens
                    </p>
                    <a className="btn btn-bordered active d-inline-block">
                      <i className="icon-rocket mr-2" />
                      Buy on Pancakeswap
                    </a>
                  </div>
                </div>
                <a className="cta-link" />
              </div>
            </div>
          </div>
        </section>
        {/* ***** CTA Area End ***** */}
        {/*====== Footer Area Start ======*/}
        <footer className="footer-area">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 text-center">
                {/* Footer Items */}
                <div className="footer-items">
                  {/* Logo */}
                  <a className="navbar-brand" href="/">
                    <img src="/img/logo/logo.png" alt="logo" />
                  </a>
                  <div className="social-share ml-auto">
                    <ul
                      className="d-flex list-unstyled"
                      style={{ justifyContent: "center" }}
                    >
                      <li>
                        <a href="">
                          <i className="fab fa-telegram" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fab fa-telegram" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fas fa-globe" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fab fa-twitter" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="copyright-area py-4">
                    ©2023 Alexapro, All Rights Reserved By{" "}
                    <a href="#" target="_blank">
                      Alexapro
                    </a>
                  </div>
                </div>
                {/* Scroll To Top */}
                <div id="scroll-to-top" className="scroll-to-top">
                  <a href="#header" className="smooth-anchor">
                    <i className="fa-solid fa-arrow-up" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/*====== Footer Area End ======*/}
        {/*====== Modal Search Area Start ======*/}
        <div id="search" className="modal fade p-0">
          <div className="modal-dialog dialog-animated">
            <div className="modal-content h-100">
              <div className="modal-header" data-dismiss="modal">
                Search <i className="far fa-times-circle icon-close" />
              </div>
              <div className="modal-body">
                <form className="row">
                  <div className="col-12 align-self-center">
                    <div className="row">
                      <div className="col-12 pb-3">
                        <h2 className="search-title mt-0 mb-3">
                          What are you looking for?
                        </h2>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 input-group mt-md-4">
                        <input type="text" placeholder="Enter your keywords" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 input-group align-self-center">
                        <button className="btn btn-bordered-white mt-3">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/*====== Modal Search Area End ======*/}
        {/*====== Modal Responsive Menu Area Start ======*/}
        <div id="menu" className="modal fade p-0">
          <div className="modal-dialog dialog-animated">
            <div className="modal-content h-100">
              <div className="modal-header" data-dismiss="modal">
                Menu <i className="far fa-times-circle icon-close" />
              </div>
              <div className="menu modal-body">
                <div className="row w-100">
                  <div className="items p-0 col-12 text-center" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*====== Modal Responsive Menu Area End ======*/}
      </div>
    </div>
  );
}

export default App;
