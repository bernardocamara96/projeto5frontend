import StandardList from "../components/Lists/StandardList";
import HeaderScrum from "../components/Headers/HeaderScrum";
import { userStore } from "../stores/userStore";
import Footer from "../components/Footers/Footer";
import AsideMenu from "../components/Menus/AsideMenu";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function CategoriesList() {
   const user = userStore.getState().user;

   return (
      <>
         <HeaderScrum />
         <div id="main-taskList">
            <AsideMenu type={user.role} />
            <StandardList type="categoriesList" />
         </div>
         <Footer />
         <AlertsMessage />
      </>
   );
}
