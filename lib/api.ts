import {
  AdminOrder,
  AdminPricelistItem,
  AdminCustomer,
  AdminTestimonial,
  OrderStatus,
} from "@/types/admin";

function withCacheBuster(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
}

const NO_CACHE_FETCH_OPTIONS: RequestInit = {
  cache: "no-store",
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
  },
};

export async function fetchOrders(): Promise<AdminOrder[]> {
  try {
    const res = await fetch(withCacheBuster("/api/orders"), NO_CACHE_FETCH_OPTIONS);
    const json = await res.json();
    if (!json.success || !json.data) return [];

    return json.data.map((row: any): AdminOrder => {
      const status = (row.order_status || "pending") as OrderStatus;
      const statusLabel =
        status === "completed"
          ? "Selesai"
          : status === "processing"
          ? "Sedang Diproses"
          : status === "cancelled"
          ? "Dibatalkan"
          : "Menunggu Pembayaran";

      return {
        id: String(row.id),
        orderNumber: row.order_code || `#BLX${row.id}`,
        robloxUsername: row.roblox_username,
        robloxUserId: row.roblox_user_id || undefined,
        robuxAmount: Number(row.robux) || 0,
        price: Number(row.price) || 0,
        status,
        statusLabel,
        paymentSource:
          row.payment_method?.toUpperCase() === "WHATSAPP" ? "WHATSAPP" : "WEBSITE",
        createdAt: row.created_at
          ? new Date(row.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Baru saja",
        hasProofPhoto: Boolean(row.payment_proof_path),
        proofPhotoUrl: row.payment_proof_path || undefined,
        whatsappNumber: row.customer_phone || "",
        notes: row.admin_notes || row.customer_notes || undefined,
      };
    });
  } catch (error) {
    console.error("fetchOrders error:", error);
    return [];
  }
}

export async function updateOrderStatus(
  orderIdOrCode: string,
  newStatus: OrderStatus,
  adminNotes?: string
): Promise<boolean> {
  try {
    const res = await fetch(
      withCacheBuster(`/api/orders/${encodeURIComponent(orderIdOrCode)}`),
      {
        ...NO_CACHE_FETCH_OPTIONS,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          order_status: newStatus,
          payment_status: newStatus === "completed" ? "paid" : undefined,
          admin_notes: adminNotes,
        }),
      }
    );
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return false;
  }
}

export async function fetchProducts(): Promise<AdminPricelistItem[]> {
  try {
    const res = await fetch(withCacheBuster("/api/products"), NO_CACHE_FETCH_OPTIONS);
    const json = await res.json();
    if (!json.success || !json.data) return [];

    return json.data.map((row: any): AdminPricelistItem => ({
      id: Number(row.id),
      robux: Number(row.robux),
      price: Number(row.price),
      isActive: Boolean(row.is_active),
      badge:
        row.robux === 2200
          ? "PROMO"
          : row.robux >= 10000
          ? "SULTAN"
          : row.robux >= 3000
          ? "POPULAR"
          : null,
    }));
  } catch (error) {
    console.error("fetchProducts error:", error);
    return [];
  }
}

export async function saveProduct(item: Partial<AdminPricelistItem>): Promise<boolean> {
  try {
    if (item.id) {
      // Edit
      const res = await fetch(withCacheBuster(`/api/products/${item.id}`), {
        ...NO_CACHE_FETCH_OPTIONS,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          robux: item.robux,
          price: item.price,
          is_active: item.isActive,
        }),
      });
      const json = await res.json();
      return Boolean(json.success);
    } else {
      // Add
      const res = await fetch(withCacheBuster("/api/products"), {
        ...NO_CACHE_FETCH_OPTIONS,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          robux: item.robux,
          price: item.price,
          is_active: item.isActive !== false,
        }),
      });
      const json = await res.json();
      return Boolean(json.success);
    }
  } catch (error) {
    console.error("saveProduct error:", error);
    return false;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const res = await fetch(withCacheBuster(`/api/products/${id}`), {
      ...NO_CACHE_FETCH_OPTIONS,
      method: "DELETE",
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("deleteProduct error:", error);
    return false;
  }
}

export async function toggleProductActive(id: number, currentActive: boolean): Promise<boolean> {
  try {
    const res = await fetch(withCacheBuster(`/api/products/${id}`), {
      ...NO_CACHE_FETCH_OPTIONS,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      body: JSON.stringify({ is_active: !currentActive }),
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("toggleProductActive error:", error);
    return false;
  }
}

export async function fetchBlacklists(): Promise<AdminCustomer[]> {
  try {
    const res = await fetch(withCacheBuster("/api/blacklists"), NO_CACHE_FETCH_OPTIONS);
    const json = await res.json();
    if (!json.success || !json.data) return [];

    return json.data.map((row: any): AdminCustomer => ({
      id: String(row.id),
      username: row.roblox_username,
      robloxId: row.roblox_user_id || "Belum terdata",
      whatsapp: row.phone || "Belum terdata",
      totalOrders: 0,
      totalSpent: 0,
      isBlacklisted: true,
      blacklistReason: row.reason || "Indikasi penipuan atau penyalahgunaan",
      lastOrderAt: row.created_at
        ? new Date(row.created_at).toLocaleDateString("id-ID")
        : "Baru saja",
    }));
  } catch (error) {
    console.error("fetchBlacklists error:", error);
    return [];
  }
}

export async function addBlacklist(data: {
  roblox_username: string;
  reason?: string;
  roblox_user_id?: string;
  phone?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(withCacheBuster("/api/blacklists"), {
      ...NO_CACHE_FETCH_OPTIONS,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("addBlacklist error:", error);
    return false;
  }
}

export async function removeBlacklist(idOrUsername: string): Promise<boolean> {
  try {
    const res = await fetch(
      withCacheBuster(`/api/blacklists/${encodeURIComponent(idOrUsername)}`),
      {
        ...NO_CACHE_FETCH_OPTIONS,
        method: "DELETE",
      }
    );
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("removeBlacklist error:", error);
    return false;
  }
}

export async function fetchTestimonials(all = true): Promise<AdminTestimonial[]> {
  try {
    const res = await fetch(
      withCacheBuster(`/api/testimonials?all=${all}`),
      NO_CACHE_FETCH_OPTIONS
    );
    const json = await res.json();
    if (!json.success || !json.data) return [];

    return json.data.map((row: any): AdminTestimonial => {
      let adminReplyText: string | undefined = undefined;
      let adminReplyDate: string | undefined = undefined;

      if (row.admin_reply) {
        if (typeof row.admin_reply === "object") {
          adminReplyText = row.admin_reply.message;
          adminReplyDate = row.admin_reply.date;
        } else if (typeof row.admin_reply === "string") {
          adminReplyText = row.admin_reply;
        }
      }

      return {
        id: String(row.id),
        name: row.name,
        role: "Verified Buyer",
        avatarText: (row.name || "UG").substring(0, 2).toUpperCase(),
        avatarGradient: "from-[#ff1b7a] to-[#00d2ff]",
        comment: row.message,
        rating: Number(row.rating) || 5,
        robuxBought: 1800,
        date: row.created_at
          ? new Date(row.created_at).toLocaleDateString("id-ID")
          : "Hari ini",
        isActive: row.status === "approved",
        adminReply: adminReplyText,
        adminReplyDate: adminReplyDate || "Baru saja",
      };
    });
  } catch (error) {
    console.error("fetchTestimonials error:", error);
    return [];
  }
}

export async function addTestimonial(data: {
  name: string;
  message: string;
  rating: number;
}): Promise<boolean> {
  try {
    const res = await fetch(withCacheBuster("/api/testimonials"), {
      ...NO_CACHE_FETCH_OPTIONS,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("addTestimonial error:", error);
    return false;
  }
}

export async function replyTestimonial(id: string, replyText: string): Promise<boolean> {
  try {
    const res = await fetch(withCacheBuster(`/api/testimonials/${id}`), {
      ...NO_CACHE_FETCH_OPTIONS,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      body: JSON.stringify({ admin_reply: replyText }),
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("replyTestimonial error:", error);
    return false;
  }
}

export async function toggleTestimonialActive(
  id: string,
  currentActive: boolean
): Promise<boolean> {
  try {
    const res = await fetch(withCacheBuster(`/api/testimonials/${id}`), {
      ...NO_CACHE_FETCH_OPTIONS,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      body: JSON.stringify({ status: currentActive ? "rejected" : "approved" }),
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("toggleTestimonialActive error:", error);
    return false;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const res = await fetch(withCacheBuster(`/api/testimonials/${id}`), {
      ...NO_CACHE_FETCH_OPTIONS,
      method: "DELETE",
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("deleteTestimonial error:", error);
    return false;
  }
}

export async function fetchStoreSettings(): Promise<any> {
  try {
    const res = await fetch(withCacheBuster("/api/store-settings"), NO_CACHE_FETCH_OPTIONS);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("fetchStoreSettings error:", error);
    return null;
  }
}

export async function saveStoreSettings(settings: any): Promise<boolean> {
  try {
    const res = await fetch(withCacheBuster("/api/store-settings"), {
      ...NO_CACHE_FETCH_OPTIONS,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (error) {
    console.error("saveStoreSettings error:", error);
    return false;
  }
}
