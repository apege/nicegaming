"use client";

import React, { useState, useEffect } from "react";
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

export default function LandingPage() {
  const [packages, setPackages] = useState<RobuxPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>({
    id: 1,
    robux: 80,
    price: 1600,
    priceFormatted: "Rp 1.600",
  });
  const [adminWhatsapp, setAdminWhatsapp] = useState("6282343927560");
  const [storeName, setStoreName] = useState("NiceGaming");
  const [qrisImage, setQrisImage] = useState<string | undefined>(undefined);

  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState("");
  const [activeUserId, setActiveUserId] = useState("");
  const [activeWhatsapp, setActiveWhatsapp] = useState("");
  const [activeRobloxUser, setActiveRobloxUser] = useState<RobloxUser | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [prodRes, setRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/store-settings", { cache: "no-store" }),
        ]);

        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
          const mapped: RobuxPackage[] = prodJson.data
            .filter((p: any) => p.is_active !== false)
            .map((p: any) => ({
              id: Number(p.id),
              robux: Number(p.robux),
              price: Number(p.price),
              priceFormatted: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
              isBestSeller: p.robux === 240 || p.robux === 2200,
            }));
          if (mapped.length > 0) {
            setPackages(mapped);
            setSelectedPackage(mapped[0]);
          }
        }

        const setJson = await setRes.json();
        if (setJson.success && setJson.data) {
          if (setJson.data.whatsapp_number) {
            setAdminWhatsapp(setJson.data.whatsapp_number);
          }
          if (setJson.data.store_name) {
            setStoreName(setJson.data.store_name);
          }
          if (setJson.data.qris_image_path) {
            setQrisImage(setJson.data.qris_image_path);
          }
        }
      } catch (err) {
        console.error("Error loading store data:", err);
      }
    }
    loadInitialData();
  }, []);

  const [formResetKey, setFormResetKey] = useState(0);

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
    setFormResetKey((prev) => prev + 1);
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
      <Navbar storeName={storeName} />
      <Hero storeName={storeName} />
      <FeatureBar />

      {/* Main Topup Section */}
      <section id="topup" className="relative z-10 py-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <RobuxCatalog
                packages={packages}
                selectedPackage={selectedPackage}
                onSelectPackage={setSelectedPackage}
              />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <OrderForm
                key={formResetKey}
                selectedPackage={selectedPackage}
                onOpenQrisModal={handleOpenQrisModal}
                onOpenSuccessModal={handleOpenSuccessModal}
                adminWhatsapp={adminWhatsapp}
              />
              <TrustedPlayers />
            </div>
          </div>
        </div>
      </section>

      <HowToOrder />
      <Testimonials storeName={storeName} />
      <Faq />
      <Footer adminWhatsapp={adminWhatsapp} storeName={storeName} />
      <FloatingWidget adminWhatsapp={adminWhatsapp} />

      {/* Checkout Modals */}
      <QrisModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
        invoiceId={activeInvoice}
        userId={activeUserId}
        whatsapp={activeWhatsapp}
        selectedPackage={selectedPackage}
        robloxUser={activeRobloxUser}
        adminWhatsapp={adminWhatsapp}
        storeName={storeName}
        qrisImage={qrisImage}
        onConfirmPaid={() => {
          setFormResetKey((prev) => prev + 1);
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
        storeName={storeName}
      />
    </div>
  );
}
