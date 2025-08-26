
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";

const Attendance = () => {



  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "1890px",
        margin: "0 auto",
        border: "1px solid #ccc",
        boxSizing: "border-box",
      }}
    >
      <Header />
      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
          <h2>Welcome to the Employee Attendance</h2>


        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Attendance;
