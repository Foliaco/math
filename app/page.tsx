import { Header } from "@/module/common/components/header";

import { MainContent } from '../module/home/components/content'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="shrink-0">
        <Header />
      </div>
      <div className="flex min-h-0 w-full flex-1 justify-center">
        <MainContent />
      </div>
    </div>
  );
}
