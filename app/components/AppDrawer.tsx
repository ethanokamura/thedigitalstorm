"use client";
import Link from "next/link";
import { useDrawer } from "@/app/providers/DrawerProvider";
import { Dialog, DialogPanel } from "@headlessui/react";

export default function AppDrawer() {
  const { isOpen, toggleDrawer } = useDrawer();

  return (
    <div>
      <Dialog open={isOpen} onClose={toggleDrawer} className="relative z-10000">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-2xs transform transition duration-500 ease-in-out data-closed:-translate-x-full sm:duration-700"
              >
                <div className="relative flex h-full flex-col overflow-y-auto py-6 shadow-xl bg-base-200/70 backdrop-blur-[20px]">
                  <Link
                    className="text-xl font-bold px-6"
                    onClick={toggleDrawer}
                    href="/"
                  >
                    The Digital Storm
                  </Link>
                  <div className="relative mt-6 flex-1 px-6">
                    <ul className="flex flex-col gap-2 text-base-content/70 text-lg">
                      <li>
                        <Link onClick={toggleDrawer} href="/about">
                          About
                        </Link>
                      </li>
                      <li>
                        <Link onClick={toggleDrawer} href="/privacy">
                          Privacy
                        </Link>
                      </li>
                      <li>
                        <Link onClick={toggleDrawer} href="/legal">
                          Legal
                        </Link>
                      </li>
                      <li>
                        <Link onClick={toggleDrawer} href="/register">
                          Register
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
