import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "3D Try on CLothing",
  description: "3D Try on CLothing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider></body>
    </html>
  );
}
