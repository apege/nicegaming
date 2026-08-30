"use client";

import React, { useState } from "react";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardOverview from "@/components/admin/DashboardOverview";
import OrdersManager from "@/components/admin/OrdersManager";
import OrderDetailView from "@/components/admin/OrderDetailView";
import PricelistManager from "@/components/admin/PricelistManager";
import CustomersManager from "@/components/admin/CustomersManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import PaymentsManager from "@/components/admin/PaymentsManager";
import StoreSettings from "@/components/admin/StoreSettings";

import {
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_PRICELIST,
  INITIAL_ADMIN_CUSTOMERS,
  INITIAL_ADMIN_TESTIMONIALS,
  INITIAL_ADMIN_SETTINGS,
} from "@/constants/adminMockData";
import {
  AdminOrder,
  AdminPricelistItem,
  AdminCustomer,
  AdminTestimonial,
  AdminStoreSettings as StoreSettingsType,
  OrderStatus,
} from "@/types/admin";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Main State
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);
  const [pricelist, setPricelist] = useState<AdminPricelistItem[]>(INITIAL_ADMIN_PRICELIST);
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_ADMIN_CUSTOMERS);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(INITIAL_ADMIN_TESTIMONIALS);
  const [settings, setSettings] = useState<StoreSettingsType>(INITIAL_ADMIN_SETTINGS);

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Order Handlers
  const handleOpenOrderDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    notes?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusLabels: Record<OrderStatus, string> = {
            pending: "Menunggu Bayar",
            processing: "Sedang Diproses",
            completed: "Selesai",
            cancelled: "Dibatalkan",
          };
          const updated = {
            ...ord,
            status: newStatus,
            statusLabel: statusLabels[newStatus],
            notes: notes !== undefined ? notes : ord.notes,
          };
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );
    showToast(`Status pesanan berhasil diperbarui menjadi ${newStatus.toUpperCase()}`);
  };

  const handleQuickUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    handleUpdateOrderStatus(orderId, newStatus);
  };

  // Pricelist Handlers
  const handleSavePricelistItem = (itemData: Partial<AdminPricelistItem>) => {
    setPricelist((prev) => {
      const exists = prev.some((p) => p.id === itemData.id);
      if (exists) {
        return prev.map((p) =>
          p.id === itemData.id ? ({ ...p, ...itemData } as AdminPricelistItem) : p
        );
      } else {
        return [
          ...prev,
          {
            id: itemData.id || Date.now(),
            robux: itemData.robux || 0,
            price: itemData.price || 0,
            isActive: itemData.isActive ?? true,
            badge: itemData.badge,
          },
        ];
      }
    });
    showToast("Data nominal Robux berhasil disimpan!");
  };

  const handleDeletePricelistItem = (id: number) => {
    setPricelist((prev) => prev.filter((p) => p.id !== id));
    showToast("Paket Robux berhasil dihapus.");
  };

  const handleTogglePricelistActive = (id: number) => {
    setPricelist((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    showToast("Status ketersediaan paket berhasil diubah.");
  };

  // Customer Handlers
  const handleToggleBlacklist = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const nextState = !c.isBlacklisted;
          showToast(
            nextState
              ? `@${c.username} telah dimasukkan ke daftar blacklist.`
              : `@${c.username} berhasil dikeluarkan dari blacklist.`
          );
          return {
            ...c,
            isBlacklisted: nextState,
            blacklistReason: nextState ? "Ditambahkan manual oleh admin" : undefined,
          };
        }
        return c;
      })
    );
  };

  const handleAddBlacklist = (custData: Partial<AdminCustomer>) => {
    const newCust: AdminCustomer = {
      id: `cust-${Date.now()}`,
      username: custData.username || "Perusuh",
      robloxId: custData.robloxId || "Belum terdata",
      whatsapp: custData.whatsapp || "Belum terdata",
      totalOrders: 0,
      totalSpent: 0,
      isBlacklisted: true,
      blacklistReason: custData.blacklistReason || "Indikasi penipuan atau penyalahgunaan",
      lastOrderAt: "Baru saja",
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`@${newCust.username} berhasil ditambahkan ke daftar Blacklist!`);
  };

  // Testimonial Handlers
  const handleAddTestimonial = (t: Omit<AdminTestimonial, "id">) => {
    const newTesti: AdminTestimonial = {
      ...t,
      id: `testi-${Date.now()}`,
    };
    setTestimonials((prev) => [newTesti, ...prev]);
    showToast("Ulasan baru berhasil ditambahkan!");
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    showToast("Ulasan berhasil dihapus.");
  };

  const handleToggleTestimonialActive = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    showToast("Visibilitas ulasan berhasil diperbarui.");
  };

  const handleReplyTestimonial = (id: string, replyText: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              adminReply: replyText || undefined,
              adminReplyDate: replyText ? "Baru saja" : undefined,
            }
          : t
      )
    );
    showToast(
      replyText ? "Balasan ulasan berhasil dikirim!" : "Balasan ulasan telah dihapus."
    );
  };

  const handleRefresh = () => {
    showToast("Data berhasil disinkronkan ulang dengan server.");
  };

  const orderCounts = {
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const getPreviousTabLabel = () => {
    switch (activeTab) {
      case "order_masuk":
        return "Order Masuk";
      case "order_diproses":
        return "Order Diproses";
      case "order_selesai":
        return "Order Selesai";
      case "order_dibatalkan":
        return "Order Dibatalkan";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#070914] text-white selection:bg-[#ff1b7a] selection:text-white flex font-sans antialiased relative overflow-x-hidden">
      {/* Background Cyber Grid & Ambient Lights */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-25 z-0" />
      <div className="fixed -top-40 left-1/4 w-[500px] h-[500px] bg-[#ff1b7a]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 right-10 w-[600px] h-[600px] bg-[#00d2ff]/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#0e122b] text-white text-xs font-bold shadow-[0_0_25px_rgba(255,27,122,0.4)] border border-pink-500/40 animate-slideUp flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#ff1b7a] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedOrder(null);
          setSearchQuery("");
        }}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        orderCounts={orderCounts}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 bg-[#070914]">
        {/* Top Navigation Header */}
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-[#070914]">
          {selectedOrder ? (
            <OrderDetailView
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
              onUpdateStatus={handleUpdateOrderStatus}
              previousTabLabel={getPreviousTabLabel()}
            />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardOverview
                  orders={orders}
                  onSelectTab={setActiveTab}
                  onSelectOrder={handleOpenOrderDetail}
                />
              )}

              {(activeTab === "order_masuk" ||
                activeTab === "order_diproses" ||
                activeTab === "order_selesai" ||
                activeTab === "order_dibatalkan") && (
                <OrdersManager
                  currentTab={activeTab}
                  orders={orders}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSelectOrder={handleOpenOrderDetail}
                  onQuickUpdateStatus={handleQuickUpdateStatus}
                  onRefresh={handleRefresh}
                />
              )}

              {activeTab === "pricelist" && (
                <PricelistManager
                  pricelist={pricelist}
                  onSaveItem={handleSavePricelistItem}
                  onDeleteItem={handleDeletePricelistItem}
                  onToggleActive={handleTogglePricelistActive}
                />
              )}

              {activeTab === "pelanggan" && (
                <CustomersManager
                  customers={customers}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onToggleBlacklist={handleToggleBlacklist}
                  onRefresh={handleRefresh}
                  isBlacklistView={false}
                />
              )}

              {activeTab === "blacklist" && (
                <CustomersManager
                  customers={customers}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onToggleBlacklist={handleToggleBlacklist}
                  onAddBlacklist={handleAddBlacklist}
                  onRefresh={handleRefresh}
                  isBlacklistView={true}
                />
              )}

              {activeTab === "testimoni" && (
                <TestimonialsManager
                  testimonials={testimonials}
                  onAddTestimonial={handleAddTestimonial}
                  onDeleteTestimonial={handleDeleteTestimonial}
                  onToggleActive={handleToggleTestimonialActive}
                  onReplyTestimonial={handleReplyTestimonial}
                />
              )}

              {activeTab === "keuangan" && <PaymentsManager orders={orders} />}

              {activeTab === "pengaturan" && (
                <StoreSettings
                  settings={settings}
                  onSave={(newSettings) => {
                    setSettings(newSettings);
                    showToast("Pengaturan toko berhasil diperbarui!");
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
