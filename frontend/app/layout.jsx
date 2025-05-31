import RootLayoutClient from './layoutClient.jsx'

export const metadata = {
  title: "Homepage - IntelliSpend",
  description: "Track and manage your personal expenses",
};

export default function RootLayout({ children }) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}
