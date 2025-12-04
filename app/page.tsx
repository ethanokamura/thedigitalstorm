import Link from "next/link";
import { FaShieldAlt, FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <main className="pt-0">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-20">
          {/* Header with Icon */}
          <div className="flex justify-center items-start gap-4 ">
            <FaShieldAlt className="text-4xl text-primary" />
            <h1 className="text-5xl font-lucky tracking-wide text-base-content">
              WELCOME
            </h1>
            <FaShieldAlt className="text-4xl text-primary" />
          </div>

          {/* Main Content Card */}
          <div>
            <h1 className="text-2xl font-bold text-base-content mb-4">
              Navigating the Digital Storm
            </h1>
            <div className="prose prose-lg max-w-none space-y-6">
              <p>
                Thank you for your interest in facilitating the “Navigating the
                Digital Storm” presentation which focuses on online safety and
                scams targeting teenagers and young people in our communities.
              </p>

              <p>
                The drive behind this effort stems from the overwhelming
                response we received at recent conferences. Attendees approached
                us after every presentation, saying:{" "}
                <b>
                  “This content is vital for parents and teens. How can we help
                  spread the information you are sharing?”
                </b>{" "}
                This resource is our direct answer to those questions. Keep the
                questions coming!
              </p>
              <div className="space-y-2">
                <h2>Why Get Involved?</h2>
                <ul className="space-y-2 list-disc marker:text-primary pl-4">
                  <li>
                    <b>Community Impact:</b> Join citizens making a tangible
                    difference in their local communities.
                  </li>
                  <li>
                    <b>Education First:</b> Access comprehensive presentation
                    materials, ready to deliver with minimal customization.
                  </li>
                  <li>
                    <b>Online Safety:</b> Help protect young people from digital
                    threats and sophisticated online scams.
                  </li>
                </ul>
              </div>
              <p>
                You do not need to be a teacher, presenter, or executive to
                share this information.{" "}
                <b>
                  Simply talk and show the content to the young people and
                  parents in your life
                </b>
                : your kids, their friends, their sports teams, a classroom,
                other parents, your church or synagogue, the PTA, or any group
                where teens and parents gather. This is a battle that requires
                multiple rounds and a{" "}
                <b>lifetime of learning how to prevent scams.</b>
              </p>
              <p>
                By filling out the form below, you will give us a clearer
                picture of <b>who, to whom, where, when, and how</b> this
                presentation will be utilized. This data will better help us
                serve the community interested in protecting our young people
                from these digital threats through education.
              </p>
              <p>
                We truly appreciate your energy, effort, and drive to take on
                this vital educational work on behalf of our youth. Keep
                bringing the high energy!
              </p>
              <p>Thanks, The Digital Storm Education Team</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-base-200 hover:bg-base-300 text-base-content font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              Register Here
              <FaArrowRight className="text-base-content/70" />
            </Link>
            <p className="text-base-content/70 text-sm mt-4">
              Takes approximately 2 minutes to complete
            </p>
          </div>
          <div className="flex justify-center text-base-content/70 hover:text-base-content underline decoration-primary/70 hover:decoration-primary">
            <Link href="/privacy">Privacy Policy</Link>
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
