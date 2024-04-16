import HeaderScrum from "../components/Headers/HeaderScrum";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import AsideMenu from "../components/Menus/AsideMenu";
import Button from "react-bootstrap/Button";
import { getSessionTimeout, setConfigurationValue } from "../utilities/services";
import { useEffect, useState } from "react";
import alertStore from "../stores/alertStore";
import { userStore } from "../stores/userStore";

export default function Configurations() {
   const [timeout, setTimeout] = useState(0);
   const token = userStore.getState().user.token;

   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   useEffect(() => {
      getSessionTimeout(token, "session_timeout").then((response) => {
         if (response.ok) {
            response.json().then((data) => {
               setTimeout(data);
            });
         }
      });
   }, []);

   const handleSubmit = (e) => {
      e.preventDefault();
      setConfigurationValue(token, "session_timeout", timeout).then((response) => {
         if (response.status === 400) {
            handleAlert("Invalid value", true);
         } else if (response.ok) {
            handleAlert("Configurations saved", false);
         }
      });
   };

   return (
      <>
         <HeaderScrum />

         <div id="main-taskList">
            <AsideMenu />
            <main className="scrum-main">
               <form className="agileForm" id="form-configurations" onSubmit={handleSubmit}>
                  <div className="banner_register">
                     <p id="configurations-banner-p">
                        <i class="fas fa-tools"></i>&nbsp;&nbsp;Configurations
                     </p>
                  </div>
                  <div className="content_register">
                     <div className="agileRow" id="row-configurations-timeout">
                        <label htmlFor="session-timeout" id="timeout-label">
                           Session timeout (mins)
                        </label>
                        <input
                           type="text"
                           name="session-timeout"
                           className="form-control"
                           id="session-timeout-input"
                           value={timeout}
                           onChange={(e) => setTimeout(e.target.value)}
                        />
                     </div>
                     <Button className="btn-outline-primary" type="submit">
                        Save
                     </Button>
                  </div>
               </form>
            </main>
         </div>

         <Footer />
         <AlertsMessage />
      </>
   );
}
