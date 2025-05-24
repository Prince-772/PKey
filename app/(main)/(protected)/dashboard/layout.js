export default function DashboardLayout({ children, createpassword, user }) {
  return (
    <div className="mt-20">
      {user}
      {createpassword}
      {children}
    </div>
  );
}
export const metadata = {
  title: "Dashboard - PKey",
  description: "Manage your account, vault, and preferences securely from your PKey dashboard.",
  keywords: [
    "password manager dashboard",
    "manage vault",
    "account settings",
    "PKey user dashboard",
    "secure password management",
  ],
};
