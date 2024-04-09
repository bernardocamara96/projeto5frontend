import Login from "../components/Forms/Login";
import Header from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

function App() {
   return (
      <>
         <main className="wrapper">
            <Login />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}

export default App;
