import NavBar from "@/components/navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
