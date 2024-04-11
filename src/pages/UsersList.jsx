import HeaderScrum from "../components/Headers/HeaderScrum";
import AsideMenu from "../components/Menus/AsideMenu";
import { userStore } from "../stores/userStore";
import Footer from "../components/Footers/Footer";
import StandardList from "../components/Lists/StandardList";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function UsersList() {
   const user = userStore.getState().user;

   return (
      <>
         <HeaderScrum />

         <div id="main-taskList">
            <AsideMenu />
            <main className="scrum-main">
               <StandardList type="usersList" />
            </main>
         </div>

         <Footer />
         <AlertsMessage />
      </>
   );
}
