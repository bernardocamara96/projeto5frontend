import HeaderScrum from "../components/Headers/HeaderScrum";
import AsideMenu from "../components/Menus/AsideMenu";
import { userStore } from "../stores/userStore";
import Footer from "../components/Footers/Footer";
import ListUsers from "../components/Lists/ListUsers";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function UsersList() {
   const user = userStore.getState().user;

   return (
      <>
         <HeaderScrum />
         <div id="main-taskList">
            <AsideMenu type={user.role} />
            <ListUsers />
         </div>
         <Footer />
         <AlertsMessage />
      </>
   );
}
