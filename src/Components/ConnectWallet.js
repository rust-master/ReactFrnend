// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useState } from 'react';
// import Web3 from 'web3';

// function ConnectWallet() {
//   const [web3, setWeb3] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [address, setAddress] = useState('');

//   const connectWallet = async () => {
//     if (connected === true) { // Alternate: if (connected)
//       setWeb3(null);
//       setConnected(false);
//       setAddress('');
//       return;
//     }

//     // Check if Web3 has been injected by the browser (e.g. MetaMask)
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       window.ethereum.enable().then(async () => {
//         setWeb3(web3);
//         setConnected(true); // updated
//         const accounts = await web3.eth.getAccounts();
//         setAddress(accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     }
//   };

//   return (
//     <button onClick={connectWallet} className="btn btn-primary" style={{ backgroundColor: 'black', marginTop: '8px', borderColor: 'black' }}>
//       {connected ? `Connected!: ${address}` : 'Connect Wallet'}
//     </button>
//   );
// }

// export default ConnectWallet;

// import React, { useState } from 'react';
// import Web3 from 'web3';
// import { useWeb3React } from 'web3-react';

// function ConnectWallet() {
//   const { connector, activate, deactivate, active } = useWeb3React();
//   const [address, setAddress] = useState('');

//   const connectWallet = async () => {
//     if (active) {
//       deactivate();
//     } else {
//       activate();
//     }
//   };

//   connector &&
//     connector
//       .getAccount()
//       .then((account) => setAddress(account.slice(0, 6) + '...' + account.slice(-4)))
//       .catch(console.error);

//   return (
//     <a href="#" className="btn ml-lg-auto btn-bordered-white" onClick={connectWallet}>
//       <i className="icon-wallet mr-md-2" />
//       {active ? `Connected: ${address}` : 'Wallet Connect'}
//     </a>
//   );
// }

// export default ConnectWallet;





///////// WORKING
// import React, { useState } from 'react';
// import Web3 from 'web3';

// function ConnectWallet() {
//   const [web3, setWeb3] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [address, setAddress] = useState('');

//   const connectWallet = async () => {
//     if (connected === true) { // Alternate: if (connected)
//       setWeb3(null);
//       setConnected(false);
//       setAddress('');
//       return;
//     }

//     // Check if Web3 has been injected by the browser (e.g. MetaMask)
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       window.ethereum.enable().then(async () => {
//         setWeb3(web3);
//         setConnected(true); // updated
//         const accounts = await web3.eth.getAccounts();
//         setAddress(accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     }
//   };

//   return (
//     <a href="#" className="btn ml-lg-auto btn-bordered-white" onClick={connectWallet}>
//       {connected ? `Connected!: ${address}` : 'Connect Wallet'}
//     </a>
//   );
// }

// export default ConnectWallet;







/////

// import React, { useState } from 'react';
// import Web3 from 'web3';

// function ConnectWallet() {
//   const [web3, setWeb3] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [address, setAddress] = useState('');

//   const connectWallet = async () => {
//     if (connected === true) { // Alternate: if (connected)
//       setWeb3(null);
//       setConnected(false);
//       setAddress('');
//       return;
//     }

//     // Check if Web3 has been injected by the browser (e.g. MetaMask)
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       window.ethereum.enable().then(async () => {
//         setWeb3(web3);
//         setConnected(true); // updated
//         const accounts = await web3.eth.getAccounts();
//         setAddress(accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));
//         // console.log("accounts: ", accounts)

//       })
//       .catch(error => {
//         console.error(error);
//       });
//     }
//   };

//   return (
//     <button onClick={connectWallet} className="btn btn-primary" >
//       {connected ? `Connected!: ${address}` : 'Connect Wallet'}
//     </button>
//   );
// }

// export default ConnectWallet;

import React, { useState } from 'react';
import Web3 from 'web3';

function ConnectWallet() {
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    if (connected === true) { // Alternate: if (connected)
      setWeb3(null);
      setConnected(false);
      setAddress('');
      return;
    }

    // Check if Web3 has been injected by the browser (e.g. MetaMask)
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable().then(async () => {
        setWeb3(web3);
        setConnected(true); // updated
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));
        // console.log("accounts: ", accounts)

      })
      .catch(error => {
        console.error(error);
      });
    }
  };

  return (
    <button onClick={connectWallet} className="btn btn-primary" >
      {connected ? `Connected!: ${address}` : 'Connect Wallet'}
    </button>
  );
}

export default ConnectWallet;
