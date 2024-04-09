import EditOwnProfile from "../components/Forms/EditOwnProfile";
import HeaderScrum from "../components/Headers/HeaderScrum";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function OwnUserEdit() {
   return (
      <>
         <HeaderScrum />
         <EditOwnProfile />
         <Footer />
         <AlertsMessage />
      </>
   );
}
