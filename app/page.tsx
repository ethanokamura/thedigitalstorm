import Link from "next/link";
import { FaShieldAlt, FaUsers, FaBook, FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <main className="pt-0">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header with Icon */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
              <FaShieldAlt className="text-base-content text-4xl" />
            </div>
            <h1 className="text-5xl font-bold text-base-content mb-4">
              Welcome
            </h1>
          </div>

          {/* Main Content Card */}
          <div className="bg-base-200 rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-base-content/70 leading-relaxed">
                Thank you for your interest in receiving and delivering the{" "}
                <b>DigitialStorm</b> presentation with a focus on online safety
                and scams targeted at teenagers & young people.
              </p>

              <p className="text-base-content/70 leading-relaxed">
                By filling out the details below, we will have a better idea
                who, where, when and how this presentation will be utilized.
                This will better help us serve the community of parties
                interested in helping our young people learn and defend
                themselves against these threats.
              </p>

              <p className="text-base-content/70 leading-relaxed">
                We really appreciate your energy, efforts and drive to take on
                these threats through education.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-base-200 rounded-xl p-6 shadow-md w-full">
              <div className="flex items-center text-lg gap-2 mb-2">
                <FaShieldAlt className="text-primary" />
                <h3 className="font-semibold text-base-content">
                  Online Safety
                </h3>
              </div>
              <p className="text-base-content/70 text-sm">
                Protect young people from digital threats and online scams
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-6 shadow-md w-full">
              <div className="flex items-center text-lg gap-2 mb-2">
                <FaUsers className="text-primary" />
                <h3 className="font-semibold text-base-content">
                  Community Impact
                </h3>
              </div>
              <p className="text-base-content/70 text-sm">
                Join educators making a difference in their communities
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-6 shadow-md w-full">
              <div className="flex items-center text-lg gap-2 mb-2">
                <FaBook className="text-primary" />
                <h3 className="font-semibold text-base-content">
                  Education First
                </h3>
              </div>
              <p className="text-base-content/70 text-sm">
                Comprehensive presentation materials ready to deliver
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-primary hover:bg-accent text-base-content font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              Get Started with Registration
              <FaArrowRight className="text-xl" />
            </Link>
            <p className="text-base-content/70 text-sm mt-4">
              Takes approximately 2 minutes to complete
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-base-300">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-base-content/70 text-sm">
            TheDigitalStorm - Committed to digital safety education.
          </p>
        </div>
      </div>
    </main>
  );
}
