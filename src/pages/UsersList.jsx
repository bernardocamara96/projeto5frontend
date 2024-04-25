import HeaderScrum from "../components/Headers/HeaderScrum";
import AsideMenu from "../components/Menus/AsideMenu";
import { userStore } from "../stores/userStore";
import Footer from "../components/Footers/Footer";
import StandardList from "../components/Lists/StandardList";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import notificationsStore from "../stores/notificationsStore";

export default function UsersList() {
   const user = userStore.getState().user;
   const setSeeNotifications = notificationsStore((state) => state.setSeeNotifications);

   return (
      <>
         <HeaderScrum />

         <div id="main-taskList">
            <AsideMenu />
            <main className="scrum-main" onClick={() => setSeeNotifications(false)}>
               <StandardList type="usersList" />
            </main>
         </div>

         <Footer />
         <AlertsMessage />
      </>
   );
}
