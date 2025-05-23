export default function DashboardLayout({ children, createpassword, user }) {
  return (
    <div className="mt-20">
      {user}
      {createpassword}
      {children}
    </div>
  );
}
