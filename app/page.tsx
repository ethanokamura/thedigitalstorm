import Image from "next/image";
import Link from "next/link";
import title from "@/app/assets/title.svg";
import hero from "@/app/assets/hero.png";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      <div className="h-screen w-screen overflow-hidden bg-linear-to-br from-primary to-accent flex flex-col">
        <div className="w-screen bg-linear-to-b to-base-200 via-transparent h-screen flex flex-col items-center pt-40 px-10">
          <Image src={title} alt="title" className="w-full max-w-3xl h-auto" />
          <Image
            src={hero}
            alt="heros"
            className="w-full max-w-2xl mx-auto h-auto"
          />
          <div className="flex flex-col sm:flex-row items-center gap-4 absolute mx-auto sm:right-20 bottom-20">
            <Link
              href="register"
              className="text-2xl px-8 pt-4 pb-2 bg-primary rounded text-base-100 font-lucky"
            >
              Register Here
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-2xl px-8 pt-4 pb-2 bg-base-100 rounded text-primary ring-primary ring font-lucky"
            >
              Learn More
              <FaArrowRight className="pb-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
