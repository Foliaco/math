import { Header } from "@/module/common/components/header";

import { MainContent } from '../module/home/components/content'

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-[10%] max-h-17.5">
        <Header />
      </div>
      <div className="h-[95%] max-h-[calc(100vh-17.5rem)] w-full flex justify-center items-center">
        <MainContent />
      </div>
    </div>
  );
}
