import Login from "../components/Forms/Login";
import Header from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { useState } from "react";

function App() {
   const [english, setEnglish] = useState(true);
   return (
      <>
         <div id="languages-row-login">
            <div style={{ fontWeight: !english && "bold" }} onClick={() => setEnglish(false)}>
               PT
            </div>
            <div style={{ fontWeight: english && "bold" }} onClick={() => setEnglish(true)}>
               EN
            </div>
         </div>
         <main className="wrapper">
            <Login />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}

export default App;
