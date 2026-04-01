import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KGHRC - Kanke General Hospital & Research Centre",
  description: "Kanke General Hospital & Research Centre is a 100 bedded multi-speciality hospital located in Ranchi. The hospital started as a small OPD in 1990 by Dr. Shambhu Prasad Singh and later developed into a modern healthcare institution. It was registered under the Clinical Establishment Act on 9 March 2009. The hospital is committed to providing high quality and affordable healthcare services with experienced doctors, trained staff and modern medical equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
