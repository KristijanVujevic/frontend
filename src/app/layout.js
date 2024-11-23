import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "DYS Webshop",
  description: "E-commerce webshop for DYS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center sticky bottom-0">
          <p className="text-sm text-center text-gray-500 ">
            &copy; {new Date().getFullYear()} DotYourSpot. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
