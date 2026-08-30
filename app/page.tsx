"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureBar from "@/components/FeatureBar";
import RobuxCatalog from "@/components/RobuxCatalog";
import OrderForm from "@/components/OrderForm";
import TrustedPlayers from "@/components/TrustedPlayers";
import HowToOrder from "@/components/HowToOrder";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import FloatingWidget from "@/components/FloatingWidget";
import QrisModal from "@/components/QrisModal";
import OrderModal from "@/components/OrderModal";
import { RobuxPackage, RobloxUser } from "@/types";
import { ROBUX_PACKAGES } from "@/constants";

export default function LandingPage() {
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(ROBUX_PACKAGES[2]); // 240 Robux (Best Seller)
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState("");
  const [activeUserId, setActiveUserId] = useState("");
  const [activeWhatsapp, setActiveWhatsapp] = useState("");
  const [activeRobloxUser, setActiveRobloxUser] = useState<RobloxUser | null>(null);

  const handleOpenQrisModal = (
    invId: string,
    user: string,
    wa: string,
    rUser: RobloxUser | null
  ) => {
    setActiveInvoice(invId);
    setActiveUserId(user);
    setActiveWhatsapp(wa);
    setActiveRobloxUser(rUser);
    setIsQrisModalOpen(true);
  };

  const handleOpenSuccessModal = (
    invId: string,
    user: string,
    wa: string,
    rUser: RobloxUser | null
  ) => {
    setActiveInvoice(invId);
    setActiveUserId(user);
    setActiveWhatsapp(wa);
    setActiveRobloxUser(rUser);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070714] text-white selection:bg-[#ff1b7a] selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows & Cyber Grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0"></div>
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-[#ff1b7a]/20 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-[#00d2ff]/15 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute top-[800px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#ff1b7a]/10 rounded-full blur-[180px] pointer-events-none z-0"></div>

      {/* Modular Section Components */}
      <Navbar />
      <Hero />
      <FeatureBar />

      {/* Main Topup Section */}
      <section id="topup" className="relative z-10 py-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <RobuxCatalog
                selectedPackage={selectedPackage}
                onSelectPackage={setSelectedPackage}
              />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <OrderForm
                selectedPackage={selectedPackage}
                onOpenQrisModal={handleOpenQrisModal}
                onOpenSuccessModal={handleOpenSuccessModal}
              />
              <TrustedPlayers />
            </div>
          </div>
        </div>
      </section>

      <HowToOrder />
      <Testimonials />
      <Faq />
      <Footer />
      <FloatingWidget />

      {/* Checkout Modals */}
      <QrisModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
        invoiceId={activeInvoice}
        userId={activeUserId}
        whatsapp={activeWhatsapp}
        selectedPackage={selectedPackage}
        robloxUser={activeRobloxUser}
        onConfirmPaid={() => {
          setIsQrisModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />

      <OrderModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        invoiceId={activeInvoice}
        userId={activeUserId}
        selectedPackage={selectedPackage}
      />
    </div>
  );
}
