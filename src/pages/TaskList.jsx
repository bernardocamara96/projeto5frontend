import StandardList from "../components/Lists/StandardList";
import HeaderScrum from "../components/Headers/HeaderScrum";
import { userStore } from "../stores/userStore";
import Footer from "../components/Footers/Footer";
import AsideMenu from "../components/Menus/AsideMenu";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function TaskList() {
   const user = userStore.getState().user;

   return (
      <>
         <HeaderScrum />

         <div id="main-taskList">
            <AsideMenu />
            <main className="scrum-main">
               <StandardList id="task-list" type="taskList" />
            </main>
         </div>

         <Footer />
         <AlertsMessage />
      </>
   );
}
