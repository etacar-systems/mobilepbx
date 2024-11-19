// import React, { useState } from 'react';
// import axios from 'axios';

// const Whatsapp = () => {
//   const [businessName, setBusinessName] = useState('');
//   const [businessEmail, setBusinessEmail] = useState('');
//   const [appStatus, setAppStatus] = useState(null);
//   const [testNumber, setTestNumber] = useState(null);
//   const [token, setToken] = useState(null);

//   const handleCreateApp = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/v1/api/api', {
//         businessName,
//         businessEmail
//       });
//       setAppStatus(response.data.status);
//       if (response.data.testNumber) {
//         setTestNumber(response.data.testNumber);
//       }
//       if (response.data.token) {
//         setToken(response.data.token);
//       }
//     } catch (error) {
//       setAppStatus('Error: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   return (
//     <div>
//       <h2>Create WhatsApp Business App</h2>
//       <form onSubmit={handleCreateApp}>
//         <div>
//           <label htmlFor="businessName">Business Name:</label>
//           <input
//             type="text"
//             id="businessName"
//             value={businessName}
//             onChange={(e) => setBusinessName(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="businessEmail">Business Email:</label>
//           <input
//             type="email"
//             id="businessEmail"
//             value={businessEmail}
//             onChange={(e) => setBusinessEmail(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Create App</button>
//       </form>
//       {appStatus && <p>App Status: {appStatus}</p>}
//       {testNumber && <p>Test Number: {testNumber}</p>}
//       {token && <p>Token: {token}</p>}
//     </div>
//   );
// };

// export default Whatsapp;
// // import { LoginSocialFacebook } from "reactjs-social-login";
// // import { FacebookLoginButton } from "react-social-login-buttons";
// // export default function Whatsapp() {
// //   return (
// //     <LoginSocialFacebook
// //       appId="1025301432541441"
// //       onResolve={(res) => {
// //         console.log("response", res);
// //       }}
// //       onReject={(error) => {
// //         console.log("response", error);
// //       }}
// //     >
// //       <FacebookLoginButton />
// //     </LoginSocialFacebook>
// //   );
// // }
