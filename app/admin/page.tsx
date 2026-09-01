"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import RetentionWarningBanner from "@/components/admin/RetentionWarningBanner";

import {
  fetchOrders,
  updateOrderStatus,
  fetchProducts,
  saveProduct,
  deleteProduct,
  toggleProductActive,
  fetchBlacklists,
  addBlacklist,
  removeBlacklist,
  fetchTestimonials,
  addTestimonial,
  replyTestimonial,
  toggleTestimonialActive,
  deleteTestimonial,
  fetchStoreSettings,
  saveStoreSettings,
} from "@/lib/api";

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
  const [isLoading, setIsLoading] = useState(true);

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

  // Load live data from Neon API
  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [dbOrders, dbProducts, dbBlacklists, dbTestis, dbSettings] =
        await Promise.all([
          fetchOrders(),
          fetchProducts(),
          fetchBlacklists(),
          fetchTestimonials(true),
          fetchStoreSettings(),
        ]);

      setOrders(dbOrders);
      setPricelist(dbProducts);
      setTestimonials(dbTestis);

      // Build customer directory from Orders + Blacklists
      const customerMap = new Map<string, AdminCustomer>();

      // 1. Add all blacklisted accounts
      dbBlacklists.forEach((b) => {
        customerMap.set(b.username.toLowerCase(), {
          id: b.id,
          username: b.username,
          robloxId: b.robloxId || "Belum terdata",
          whatsapp: b.whatsapp || "Belum terdata",
          totalOrders: 0,
          totalSpent: 0,
          isBlacklisted: true,
          blacklistReason: b.blacklistReason,
          lastOrderAt: b.lastOrderAt,
        });
      });

      // 2. Aggregate orders for active customers
      dbOrders.forEach((ord) => {
        const userKey = ord.robloxUsername.toLowerCase();
        const existing = customerMap.get(userKey);
        const orderSpent = ord.status === "completed" ? ord.price : 0;

        if (existing) {
          existing.totalOrders += 1;
          existing.totalSpent += orderSpent;
          if (ord.robloxUserId && existing.robloxId === "Belum terdata") {
            existing.robloxId = ord.robloxUserId;
          }
          if (ord.whatsappNumber && existing.whatsapp === "Belum terdata") {
            existing.whatsapp = ord.whatsappNumber;
          }
        } else {
          customerMap.set(userKey, {
            id: `cust-${userKey}`,
            username: ord.robloxUsername,
            robloxId: ord.robloxUserId || "Belum terdata",
            whatsapp: ord.whatsappNumber || "Belum terdata",
            totalOrders: 1,
            totalSpent: orderSpent,
            isBlacklisted: false,
            lastOrderAt: ord.createdAt,
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));

      if (dbSettings) {
        setSettings({
          storeName: dbSettings.store_name || "NiceGaming",
          storeStatus: "open",
          adminWhatsapp: dbSettings.whatsapp_number || "6282343927560",
          minTopup: 80,
          maxTopup: 50000,
          ratePer1k: 20000,
          noticeBanner:
            dbSettings.promo_subtitle ||
            "⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!",
          qrisActive: true,
          whatsappOrderActive: true,
          promoRobux: dbSettings.promo_robux_amount
            ? dbSettings.promo_robux_amount.toLocaleString("id-ID")
            : "2.200",
          promoPrice: dbSettings.promo_discount_price
            ? dbSettings.promo_discount_price.toLocaleString("id-ID")
            : "45.000",
          promoNormalPrice: dbSettings.promo_original_label || "55.000",
          promoEndDate: dbSettings.promo_end_date
            ? dbSettings.promo_end_date.split("T")[0]
            : "2026-09-05",
          isPromoActive:
            dbSettings.promo_active !== undefined ? dbSettings.promo_active : true,
          qrisImagePath: dbSettings.qris_image_path || undefined,
          logoImagePath: dbSettings.logo_image_path || undefined,
        });
      }
    } catch (error) {
      console.error("Error loading real data from Neon:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Order Handlers
  const handleOpenOrderDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    notes?: string
  ) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
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
          if (
            selectedOrder &&
            (selectedOrder.id === orderId || selectedOrder.orderNumber === orderId)
          ) {
            setSelectedOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );

    // Call real Neon API
    await updateOrderStatus(orderId, newStatus, notes);
    const freshOrders = await fetchOrders();
    setOrders(freshOrders);
    showToast(`Status pesanan berhasil diperbarui menjadi ${newStatus.toUpperCase()}`);
  };

  const handleQuickUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    handleUpdateOrderStatus(orderId, newStatus);
  };

  // Pricelist Handlers
  const handleSavePricelistItem = async (itemData: Partial<AdminPricelistItem>) => {
    await saveProduct(itemData);
    const updatedProducts = await fetchProducts();
    setPricelist(updatedProducts);
    showToast("Data nominal Robux berhasil disimpan ke database!");
  };

  const handleDeletePricelistItem = async (id: number) => {
    await deleteProduct(id);
    const updatedProducts = await fetchProducts();
    setPricelist(updatedProducts);
    showToast("Paket Robux berhasil dihapus.");
  };

  const handleTogglePricelistActive = async (id: number) => {
    const item = pricelist.find((p) => p.id === id);
    if (item) {
      await toggleProductActive(id, item.isActive);
      const updatedProducts = await fetchProducts();
      setPricelist(updatedProducts);
      showToast("Status ketersediaan paket berhasil diubah.");
    }
  };

  // Customer Handlers
  const handleToggleBlacklist = async (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      if (cust.isBlacklisted) {
        await removeBlacklist(cust.username || customerId);
      } else {
        await addBlacklist({
          roblox_username: cust.username,
          phone: cust.whatsapp !== "Belum terdata" ? cust.whatsapp : undefined,
          reason: "Ditambahkan manual oleh admin",
        });
      }
      await loadAllData();
      showToast(
        cust.isBlacklisted
          ? `@${cust.username} berhasil dikeluarkan dari blacklist.`
          : `@${cust.username} telah dimasukkan ke daftar blacklist.`
      );
    }
  };

  const handleAddBlacklist = async (custData: Partial<AdminCustomer>) => {
    if (custData.username) {
      await addBlacklist({
        roblox_username: custData.username,
        reason: custData.blacklistReason || "Indikasi penipuan atau penyalahgunaan",
        roblox_user_id: custData.robloxId !== "Belum terdata" ? custData.robloxId : undefined,
        phone: custData.whatsapp !== "Belum terdata" ? custData.whatsapp : undefined,
      });
      await loadAllData();
      showToast(`@${custData.username} berhasil ditambahkan ke daftar Blacklist!`);
    }
  };

  // Testimonial Handlers
  const handleAddTestimonial = async (t: Omit<AdminTestimonial, "id">) => {
    await addTestimonial({
      name: t.name,
      message: t.comment,
      rating: t.rating,
    });
    const updatedTestis = await fetchTestimonials(true);
    setTestimonials(updatedTestis);
    showToast("Ulasan baru berhasil ditambahkan ke database!");
  };

  const handleDeleteTestimonial = async (id: string) => {
    await deleteTestimonial(id);
    const updatedTestis = await fetchTestimonials(true);
    setTestimonials(updatedTestis);
    showToast("Ulasan berhasil dihapus.");
  };

  const handleToggleTestimonialActive = async (id: string) => {
    const item = testimonials.find((t) => t.id === id);
    if (item) {
      await toggleTestimonialActive(id, item.isActive);
      const updatedTestis = await fetchTestimonials(true);
      setTestimonials(updatedTestis);
      showToast("Visibilitas ulasan berhasil diperbarui.");
    }
  };

  const handleReplyTestimonial = async (id: string, replyText: string) => {
    await replyTestimonial(id, replyText);
    const updatedTestis = await fetchTestimonials(true);
    setTestimonials(updatedTestis);
    showToast(
      replyText ? "Balasan ulasan berhasil disimpan ke database!" : "Balasan ulasan telah dihapus."
    );
  };

  const handleRefresh = async () => {
    await loadAllData();
    showToast("Data berhasil disinkronkan ulang dengan Neon PostgreSQL.");
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
        }}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        orderCounts={orderCounts}
        storeName={settings.storeName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          storeName={settings.storeName}
          orders={orders}
          onSelectOrder={handleOpenOrderDetail}
          onSelectTab={setActiveTab}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <RetentionWarningBanner />

          {/* Order Detail View */}
          {selectedOrder ? (
            <OrderDetailView
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
              onUpdateStatus={handleUpdateOrderStatus}
              previousTabLabel={getPreviousTabLabel()}
              storeName={settings.storeName}
            />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardOverview
                  orders={orders}
                  onSelectTab={setActiveTab}
                  onSelectOrder={handleOpenOrderDetail}
                  storeName={settings.storeName}
                />
              )}

              {(activeTab === "order_masuk" ||
                activeTab === "order_diproses" ||
                activeTab === "order_selesai" ||
                activeTab === "order_dibatalkan") && (
                <OrdersManager
                  orders={orders}
                  currentTab={activeTab}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onQuickUpdateStatus={handleQuickUpdateStatus}
                  onSelectOrder={handleOpenOrderDetail}
                  onRefresh={handleRefresh}
                  storeName={settings.storeName}
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
                  onSave={async (newSettings) => {
                    setSettings(newSettings);
                    const cleanRobux = parseInt(
                      (newSettings.promoRobux || "2200").replace(/\D/g, ""),
                      10
                    );
                    const cleanPrice = parseInt(
                      (newSettings.promoPrice || "45000").replace(/\D/g, ""),
                      10
                    );
                    await saveStoreSettings({
                      store_name: newSettings.storeName,
                      whatsapp_number: newSettings.adminWhatsapp,
                      promo_active: newSettings.isPromoActive,
                      promo_robux_amount: cleanRobux,
                      promo_original_label: newSettings.promoNormalPrice,
                      promo_discount_price: cleanPrice,
                      promo_end_date: newSettings.promoEndDate,
                      promo_subtitle: newSettings.noticeBanner,
                      qris_image_path: newSettings.qrisImagePath,
                      logo_image_path: newSettings.logoImagePath,
                    });

                    const freshSettings = await fetchStoreSettings();
                    if (freshSettings) {
                      setSettings({
                        storeName: freshSettings.store_name || "NiceGaming",
                        storeStatus: "open",
                        adminWhatsapp: freshSettings.whatsapp_number || "6282343927560",
                        minTopup: 80,
                        maxTopup: 50000,
                        ratePer1k: 20000,
                        noticeBanner:
                          freshSettings.promo_subtitle ||
                          "⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!",
                        qrisActive: true,
                        whatsappOrderActive: true,
                        promoRobux: freshSettings.promo_robux_amount
                          ? freshSettings.promo_robux_amount.toLocaleString("id-ID")
                          : "2.200",
                        promoPrice: freshSettings.promo_discount_price
                          ? freshSettings.promo_discount_price.toLocaleString("id-ID")
                          : "45.000",
                        promoNormalPrice: freshSettings.promo_original_label || "55.000",
                        promoEndDate: freshSettings.promo_end_date
                          ? freshSettings.promo_end_date.split("T")[0]
                          : "2026-09-05",
                        isPromoActive:
                          freshSettings.promo_active !== undefined
                            ? freshSettings.promo_active
                            : true,
                        qrisImagePath: freshSettings.qris_image_path || undefined,
                        logoImagePath: freshSettings.logo_image_path || undefined,
                      });
                    }
                    showToast("Pengaturan toko berhasil disimpan ke database Neon!");
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
