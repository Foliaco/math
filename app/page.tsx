import type { Metadata } from "next";
import { Header } from "@/module/common/components/header";

import { MainContent } from '../module/home/components/content'

export const metadata: Metadata = {
  title: "Biblioteca matemática",
  description:
    "Busca y aprende sobre funciones, ecuaciones e identidades con expresiones matemáticas y explicaciones claras.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="shrink-0 sticky top-0 backdrop-blur-3xl">
        <Header />
      </div>
      <div className="flex min-h-0 w-full flex-1 justify-center">
        <MainContent />
      </div>
    </div>
  );
}
