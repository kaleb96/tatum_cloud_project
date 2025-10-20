import CloudDialog from "../components/CloudDialog";
import CloudTable from "../components/CloudTable";
import NavBar from "../components/NavBar";

const DashboardPage = () => {
  return (
    <>
      <NavBar />
      <CloudTable />

      {/** Dialog 영역 */}
      <CloudDialog />
    </>
  );
};

export default DashboardPage;
